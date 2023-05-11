import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import User from 'App/Models/User'

function createRandomUser() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

test.group('Users CRUD', () => {
  test('Creating user', async ({ client }) => {
    const response = await client.post('/users').form(createRandomUser())

    response.assertStatus(201)
    response.assertTextIncludes('id')
  })

  test('Loging in', async ({ client }) => {
    const userData = createRandomUser()

    await User.create(userData)

    const response = await client.post('/users/auth').form({
      email: userData.email,
      password: userData.password,
    })

    response.assertStatus(200)
    response.assertTextIncludes('token')
  })

  test('Deleting user', async ({ client }) => {
    const userData = createRandomUser()

    const user = await User.create(userData)

    const response = await client.delete(`/users/${user.id}`).guard('api').loginAs(user)

    response.assertStatus(200)
  })
})
