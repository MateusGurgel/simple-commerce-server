import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { PaymentMethods } from 'App/Enum/PaymentMethods'
import OrderProduct from './OrderProduct'
import User from './User'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public userId: number

  @column()
  public shippingAddress: String

  @column()
  public paymentMethod: PaymentMethods

  @column()
  public totalPrice: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => OrderProduct)
  public orderProduct: HasMany<typeof OrderProduct>

  @hasOne(() => User)
  public user: HasOne<typeof User>
}
