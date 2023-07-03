import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderProduct from 'App/Models/OrderProduct'
import Review from 'App/Models/Review'
import ApiResponse from 'App/Utils/ApiResponse'
import CreateReviewValidator from 'App/Validators/CreateReviewValidator'

export default class ReviewsController {
  public async index({}: HttpContextContract) {
    return Review.all()
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const reviewData = await request.validate(CreateReviewValidator)

    const user = auth.user

    if (!user) {
      return ApiResponse.error(response, 404, [{ message: 'User not found' }])
    }

    const orderProduct = await OrderProduct.find(reviewData.orderProductId)

    if (!orderProduct) {
      return ApiResponse.error(response, 404, [{ message: 'Order not found' }])
    }

    await orderProduct.load('review')
    await orderProduct.load('product')

    if (orderProduct.review) {
      return ApiResponse.error(response, 404, [{ message: 'The Order already has a review' }])
    }

    //creating the review

    const review = await orderProduct.related('review').create({ ...reviewData, userId: user.id })

    //update the product rate

    const product = orderProduct.product
    const reviews = await Review.query().where('product_id', orderProduct.productId.toString())

    const sum: number = reviews.reduce((a, b) => a + b.rate, 0)
    const rate = sum / reviews.length
    product.rate = rate

    product.save()

    return review
  }
}
