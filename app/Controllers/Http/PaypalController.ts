import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PaypalsController {
  public async getClientApiCredentials({}: HttpContextContract) {
    const clientId = await Env.get('PAYPAL_CLIENT_ID')
    return { clientId }
  }
}
