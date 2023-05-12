import { test } from '@japa/runner'
import User from 'App/Models/User'
import Product from 'App/Models/Product'
import getRandomProductData from '../../../utils/getRandomProductData'
import getRandomAdminData from '../../../utils/getRandomAdminData'

test.group('Product crud', () => {
  test('Creating product', async ({ client }) => {
    const user = await User.create(getRandomAdminData())
    const response = await client.post('/products').form(getRandomProductData()).loginAs(user)

    const expectedResponse = user.serializeComputed()

    response.assertStatus(201)
    response.assertBodyContains(expectedResponse)
  })
  test('List products', async ({ client }) => {
    await Product.create(getRandomProductData())

    const response = await client.get('/products')

    const expectedResponse = Product.all()

    response.assertStatus(200)
    response.assertBodyContains(expectedResponse)
  })

  test('Show product', async ({ client }) => {
    const product = await Product.create(getRandomProductData())
    const response = await client.get(`/products/${product.id}`)

    const expectedResponse = product.serializeComputed()

    response.assertStatus(200)
    response.assertBodyContains(expectedResponse)
  })

  test('Update product', async ({ client }) => {
    const oldProduct = await Product.create(getRandomProductData())
    const user = await User.create(getRandomAdminData())

    const response = await client
      .patch(`/products/${oldProduct.id}`)
      .form(getRandomProductData())
      .loginAs(user)

    const newProduct = await Product.findOrFail(oldProduct.id)
    const expectedResponse = newProduct.serializeComputed()

    response.assertStatus(200)
    response.assertBodyContains(expectedResponse)
  })

  test('Deleting product', async ({ client, assert }) => {
    const product = await Product.create(getRandomProductData())
    const user = await User.create(getRandomAdminData())
    const response = await client.delete(`/products/${product.id}`).loginAs(user)

    assert.isTrue(product.$isDeleted)
    response.assertStatus(200)
  })
})
