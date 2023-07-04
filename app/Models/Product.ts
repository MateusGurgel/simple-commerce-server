import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import OrderProduct from './OrderProduct'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public countInStock: number

  @column()
  public brand: string

  @column()
  public category: string

  @column()
  public price: number

  @column()
  public rate: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => OrderProduct)
  public orderProducts: HasMany<typeof OrderProduct>
}
