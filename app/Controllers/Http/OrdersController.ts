import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import Product from 'App/Models/Product'
import CreateOrderValidator from 'App/Validators/CreateOrderValidator'
import paypal from 'App/Services/paypal'
import ApiResponse from 'App/Utils/ApiResponse'

export default class OrdersController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.authorize('GetAllOrders')

    const orders = await Order.query().preload('orderProduct', (orderProductQuery) => {
      orderProductQuery.preload('product')
    })

    response.ok(orders)
  }

  public async myIndex({ response, auth }: HttpContextContract) {
    const user = auth.user

    if (!user) {
      return ApiResponse.error(response, 404, [{ message: 'User Not Found' }])
    }

    const orders = await user.related('orders').query()

    response.ok(orders)
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const { id } = params

    const user = auth.user

    if (!user) {
      return ApiResponse.error(response, 404, [{ message: 'User Not Found' }])
    }

    const order = await Order.findOrFail(id)

    await order.load('orderProduct', (orderProductQuery) => {
      orderProductQuery.preload('product')
    })

    return order
  }

  public async store({ response, request, auth }: HttpContextContract) {
    const OrderData = await request.validate(CreateOrderValidator)

    const order = await Order.create({
      userId: auth.user?.id,
      shippingAddress: OrderData.shippingAddress,
      paymentMethod: OrderData.paymentMethod,
      isPaid: false,
    })

    //Adding all the Order products && calculating the cart value

    let totalCartPrice = 0

    for (const orderProductData of OrderData.products) {
      try {
        const product = await Product.findOrFail(orderProductData.productId)

        const orderProduct = await order.related('orderProduct').create({
          orderId: order.id,
          productId: orderProductData.productId,
          quantity: orderProductData.quantity,
        })

        totalCartPrice += product.price * parseInt(orderProduct.quantity.toString())
      } catch (error) {
        return ApiResponse.error(response, 404, [{ message: 'Product not found' }])
      }
    }

    //Setting the cart total Value
    order.totalPrice = totalCartPrice

    //creating an order on Paypal API
    const paypalOrder = await paypal.createOrder(totalCartPrice.toString())
    order.checkOutOrderId = paypalOrder.id

    order.save()

    if (!paypalOrder.id) {
      order.delete()
      response.internalServerError()
    }

    response.ok(order)
  }
}
