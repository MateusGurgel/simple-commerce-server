import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import paypal from 'App/Services/paypal'

export default class PaypalsController {
  public async getClientApiCredentials({}: HttpContextContract) {
    const clientId = await Env.get('PAYPAL_CLIENT_ID')
    const userToken = await paypal.generateClientToken()
    return { clientId, userToken }
  }
}
