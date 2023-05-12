import getRandomAdminData from '../../../utils/getRandomAdminData'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Users CRUD', () => {
  test('Creating user', async ({ client }) => {
    const response = await client.post('/users').form(getRandomAdminData())

    response.assertStatus(201)
    response.assertTextIncludes('id')
  })

  test('Loging in', async ({ client }) => {
    const userData = getRandomAdminData()

    await User.create(userData)

    const response = await client.post('/users/auth').form({
      email: userData.email,
      password: userData.password,
    })

    response.assertStatus(200)
    response.assertTextIncludes('token')
  })

  test('Deleting user', async ({ client }) => {
    const userData = getRandomAdminData()

    const user = await User.create(userData)

    const response = await client.delete(`/users/${user.id}`).guard('api').loginAs(user)

    response.assertStatus(200)
  })
})
