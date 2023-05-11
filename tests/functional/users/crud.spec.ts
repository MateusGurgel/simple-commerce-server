import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

test.group('Users CRUD', () => {
  let user = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    token: '',
    id: '',
  }

  test('Creating user', async ({ client }) => {
    const response = await client.post('/users').form({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    response.assertStatus(201)
    response.assertBodyContains('id')

    const responseBody = JSON.parse(response.text())
    const id = responseBody.id
    user.id = id
  })

  test('Loging in', async ({ client }) => {
    const response = await client.post('/users/auth').form({
      email: user.email,
      password: user.password,
    })

    response.assertBodyContains('token')
    response.assertStatus(200)

    const responseBody = JSON.parse(response.text())
    const token = responseBody.token
    user.token = token
  })

  test('Deleting user', async ({ client }) => {
    const response = await client
      .delete(`/user/${user.id}`)
      .header('Authorization', `Bearer ${user.token}`)

    response.assertStatus(200)
  })
})
