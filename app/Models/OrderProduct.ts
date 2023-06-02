import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Order from './Order'

export default class OrderProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderId: Number

  @column()
  public productId: Number

  @column()
  public quantity: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Product)
  public product: HasOne<typeof Product>

  @hasOne(() => Order)
  public order: HasOne<typeof Order>
}
