import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ApiResponse from 'App/Utils/ApiResponse'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all()
    response.ok(products)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const product = await Product.findOrFail(id)

      return product
    } catch (error) {
      return ApiResponse.error(response, 404, [{ message: 'Product not found' }])
    }
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('Modifyproduct')

    const productData = await request.validate(CreateProductValidator)
    const product = await Product.create(productData)

    return response.created(product)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.authorize('Modifyproduct')

    const { id } = params
    const productData = await request.validate(CreateProductValidator)

    try {
      const product = await Product.findOrFail(id)

      product.merge(productData)

      return response.ok(product)
    } catch (error) {
      return ApiResponse.error(response, 404, [{ message: 'Product not found' }])
    }
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('Modifyproduct')
    const { id } = params

    try {
      const product = await Product.findOrFail(id)
      const isDeleted = await product.delete()
      return response.ok(isDeleted)
    } catch (error) {
      return ApiResponse.error(response, 404, [{ message: 'Product not found' }])
    }
  }
}
