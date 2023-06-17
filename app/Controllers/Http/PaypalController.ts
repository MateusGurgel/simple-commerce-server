import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import paypal from 'App/Services/paypal'
import ApiResponse from 'App/Utils/ApiResponse'
import CaptureOrderValidator from 'App/Validators/CaptureOrderValidator'

export default class PaypalsController {
  public async getClientApiCredentials({}: HttpContextContract) {
    const clientId = await Env.get('PAYPAL_CLIENT_ID')
    return { clientId }
  }

  public async captureOrder({ request, response }: HttpContextContract) {
    const paypalOrder = await request.validate(CaptureOrderValidator)

    const order = await Order.findBy('checkOutOrderId', paypalOrder.id)

    if (!order) {
      return ApiResponse.error(response, 500, [{ message: 'order not found' }])
    }

    try {
      const captureData = await paypal.capturePayment(paypalOrder.id)
      order.isPaid = true
      response.status(200).json(captureData)
    } catch (err) {
      return ApiResponse.error(response, 500, err.message)
    }

    await order.save()
  }
}
