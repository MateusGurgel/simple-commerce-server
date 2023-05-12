import { test } from '@japa/runner'
import User from 'App/Models/User'
import Product from 'App/Models/Product'
import getRandomProductData from '../../../utils/getRandomProductData'
import getRandomAdminData from '../../../utils/getRandomAdminData'

test.group('Product crud', () => {
  test('Creating product', async ({ client }) => {
    const user = await User.create(getRandomAdminData())
    const response = await client.post('/products').form(getRandomProductData()).loginAs(user)

    response.assertStatus(201)
    response.assertTextIncludes('id')
  })
  test('List products', async ({ client }) => {
    await Product.create(getRandomProductData())
    const response = await client.get('/products')

    response.assertStatus(200)
    response.assertBodyContains([])
  })

  test('Show product', async ({ client }) => {
    const product = await Product.create(getRandomProductData())
    const response = await client.get(`/products/${product.id}`)

    response.assertStatus(200)
    response.assertBodyContains('id')
  })

  test('Update product', async ({ client }) => {
    const product = await Product.create(getRandomProductData())
    const user = await User.create(getRandomAdminData())

    const response = await client
      .patch(`/products/${product.id}`)
      .form(getRandomAdminData())
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains('id')
  })

  test('Deleting product', async ({ client, assert }) => {
    const product = await Product.create(getRandomProductData())
    const user = await User.create(getRandomAdminData())
    const response = await client.delete(`/products/${product.id}`).loginAs(user)

    assert.isTrue(product.$isDeleted)
    response.assertStatus(200)
  })
})
