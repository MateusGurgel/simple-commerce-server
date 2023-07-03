import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateReviewValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string([rules.maxLength(64), rules.minLength(1)]),
    message: schema.string([rules.maxLength(1000), rules.minLength(1)]),
    rate: schema.number([rules.range(0, 5)]),
    productId: schema.number([rules.exists({ table: 'products', column: 'id' })]),
    orderProductId: schema.number([rules.exists({ table: 'order_products', column: 'id' })]),
  })

  public messages: CustomMessages = {}
}
