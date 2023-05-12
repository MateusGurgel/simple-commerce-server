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

  public async store({ request, response }: HttpContextContract) {
    const productData = await request.validate(CreateProductValidator)
    const product = Product.create(productData)

    return response.created(product)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
