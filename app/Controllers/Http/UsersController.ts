import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const userData = await request.validate(CreateUserValidator)

    const user = await User.create(userData)
    const token = await auth.use('api').attempt(userData.email, userData.password)

    return response.created({ ...user.serialize(), token: token.token })
  }

  public async auth({ response, request, auth }: HttpContextContract) {
    const userData = await request.validate(LoginValidator)

    try {
      const token = await auth.use('api').attempt(userData.email, userData.password)
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    user.delete()

    return response.status(200)
  }
}
