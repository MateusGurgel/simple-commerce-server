/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('products', 'ProductsController.index')
Route.post('products', 'ProductsController.store').middleware('auth:api')
Route.get('products/:id', 'ProductsController.show')
Route.patch('products/:id', 'ProductsController.update').middleware('auth:api')
Route.delete('products/:id', 'ProductsController.destroy').middleware('auth:api')

Route.post('users', 'UsersController.store')
Route.post('users/auth', 'UsersController.auth')
Route.delete('users/:id', 'UsersController.destroy').middleware('auth:api')

Route.get('orders', 'OrdersController.index').middleware('auth:api')
Route.get('myOrders', 'OrdersController.myIndex').middleware('auth:api')
Route.get('orders/:id', 'OrdersController.show').middleware('auth:api')
Route.post('orders', 'OrdersController.store').middleware('auth:api')
