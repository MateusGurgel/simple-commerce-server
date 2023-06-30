import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderId: Number

  @column()
  public productId: Number

  @column()
  public message: String

  @column()
  public rate: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
