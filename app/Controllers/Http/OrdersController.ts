import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import Product from 'App/Models/Product'
import CreateOrderValidator from 'App/Validators/CreateOrderValidator'

export default class OrdersController {
  public async index({ response }: HttpContextContract) {
    const orders = await Order.query().preload('orderProduct', (orderProductQuery) => {
      orderProductQuery.preload('product')
    })

    response.ok(orders)
  }

  public async store({ response, request }: HttpContextContract) {
    const OrderData = await request.validate(CreateOrderValidator)

    const order = await Order.create({
      userId: 1,
      shippingAddress: OrderData.shippingAddress,
      paymentMethod: OrderData.paymentMethod,
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

        console.log('totalCartPrice')
        totalCartPrice += product.price * parseInt(orderProduct.quantity.toString())
      } catch (error) {
        console.log(error)
        // Invalida Product Error
      }
    }

    //Getting the cart total Value
    order.totalPrice = totalCartPrice
    order.save()

    response.ok(order)
  }
}
