import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('brand').notNullable()
      table.string('categoty').notNullable()
      table.string('image').notNullable()

      table.integer('countInStock').notNullable()
      table.integer('price').notNullable()
      table.integer('rate').notNullable()

      table.text('description').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
