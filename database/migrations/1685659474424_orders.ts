import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PaymentMethods } from 'App/Enum/PaymentMethods'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('check_out_order_id')

      table.boolean('is_paid')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') //has one User
      table.string('shipping_address')

      table
        .enum('payment_method', Object.values(PaymentMethods))
        .defaultTo(PaymentMethods.PAYPAL)
        .notNullable()

      table.integer('total_price')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
