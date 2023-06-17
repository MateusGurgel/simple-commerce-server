import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ApiResponse from 'App/Utils/ApiResponse'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const userData = await request.validate(CreateUserValidator)

    const user = await User.create({ ...userData, isAdmin: true })
    const token = await auth.use('api').attempt(userData.email, userData.password)

    return response.created({ ...user.serialize(), token: token.token })
  }

  public async auth({ response, request, auth }: HttpContextContract) {
    const userData = await request.validate(LoginValidator)

    try {
      const token = await auth.use('api').attempt(userData.email, userData.password)
      const user = await User.findByOrFail('email', userData.email)
      return response.ok({ ...user.serialize(), token: token.token })
    } catch {
      return response.unauthorized({ errors: [{ message: 'Invalid credentials' }] })
    }
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const { id } = params

    const user = await User.find(id)

    if (!user) {
      return ApiResponse.error(response, 404, [{ message: 'User not found' }])
    }

    await bouncer.authorize('deleteAccount', user)

    user.delete()

    return response.status(200)
  }
}
