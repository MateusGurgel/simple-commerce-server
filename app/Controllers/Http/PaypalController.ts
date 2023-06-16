import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import paypal from 'App/Services/paypal'
import CaptureOrderValidator from 'App/Validators/CaptureOrderValidator'

export default class PaypalsController {
  public async getClientApiCredentials({}: HttpContextContract) {
    const clientId = await Env.get('PAYPAL_CLIENT_ID')
    return { clientId }
  }

  public async captureOrder({ request, response }: HttpContextContract) {
    const paypalOrder = await request.validate(CaptureOrderValidator)

    const order = await Order.findByOrFail('checkOutOrderId', paypalOrder.id)

    try {
      const captureData = await paypal.capturePayment(paypalOrder.id)
      order.isPaid = true
      response.status(200).json(captureData)
    } catch (err) {
      return response.status(500).send(err.message)
    }

    await order.save()
  }
}
