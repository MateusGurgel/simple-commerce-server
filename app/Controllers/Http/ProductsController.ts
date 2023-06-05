import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all()
    response.ok(products)
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    const product = await Product.findOrFail(id)

    return product
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('CreateProduct')

    const productData = await request.validate(CreateProductValidator)
    const product = await Product.create(productData)

    return response.created(product)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { id } = params
    const product = await Product.findOrFail(id)

    const productData = await request.validate(CreateProductValidator)
    product.merge(productData)

    return response.ok(product)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const product = await Product.findOrFail(id)

    const isDeleted = await product.delete()

    return response.ok(isDeleted)
  }
}
