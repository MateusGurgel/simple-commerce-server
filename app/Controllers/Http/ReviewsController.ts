import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
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

    const order = await Order.find(reviewData.orderId)

    if (!order) {
      return ApiResponse.error(response, 404, [{ message: 'Order not found' }])
    }
    await order.load('review')

    if (order.review) {
      return ApiResponse.error(response, 404, [{ message: 'The Order already has a review' }])
    }

    const review = order.related('review').create({ ...reviewData, userId: user.id })
    return review
  }
}
