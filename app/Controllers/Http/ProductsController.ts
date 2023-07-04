import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ApiResponse from 'App/Utils/ApiResponse'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all()
    response.ok(products)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const product = await Product.findOrFail(id)

      await product.load('orderProducts')

      for (let index = 0; index < product.orderProducts.length; index++) {
        await product.orderProducts[index].load('review')
      }

      product.orderProducts

      return product
    } catch (error) {
      return ApiResponse.error(response, 404, [{ message: 'Product not found' }])
    }
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('Modifyproduct')

    const data = await request.validate(CreateProductValidator)

    await data.image.moveToDisk('./')

    if (!data.image.fileName) {
      return ApiResponse.error(response, 500, [{ message: 'File not found' }])
    }

    const imageUrl = await Drive.getUrl(data.image.fileName)

    let productData: {
      name: string
      description: string
      countInStock: number
      brand: string
      category: string
      price: number
      image: string
    } = {
      name: data.name,
      description: data.description,
      countInStock: data.countInStock,
      brand: data.brand,
      category: data.category,
      price: data.price,
      image: imageUrl,
    }

    const product = await Product.create(productData)

    return response.created(product)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.authorize('Modifyproduct')

    const { id } = params
    const data = await request.validate(UpdateProductValidator)

    let productData: {
      name?: string
      description?: string
      countInStock?: number
      brand?: string
      category?: string
      price?: number
      image?: string
    } = {
      name: data.name,
      description: data.description,
      countInStock: data.countInStock,
      brand: data.brand,
      category: data.category,
      price: data.price,
    }

    if (data.image) {
      await data.image.moveToDisk('./')

      if (!data.image.fileName) {
        return ApiResponse.error(response, 500, [{ message: 'File not found' }])
      }

      const imageUrl = await Drive.getUrl(data.image.fileName)
      productData = { ...productData, image: imageUrl }
    }

    try {
      const product = await Product.findOrFail(id)

      product.merge(productData)
      product.save()

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
