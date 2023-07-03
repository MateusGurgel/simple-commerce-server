import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('Users.id').onDelete('CASCADE') //has one product
      table.integer('product_id').unsigned().references('Products.id').onDelete('CASCADE') //has one product
      table.integer('order_id').unsigned().references('Orders.id').onDelete('CASCADE') //has one order

      table.text('message')
      table.integer('rate')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
