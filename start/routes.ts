import Route from '@ioc:Adonis/Core/Route'

Route.get('products', 'ProductsController.index')
Route.get('products/search', 'ProductsController.search')
Route.get('products/:id', 'ProductsController.show')
Route.post('products', 'ProductsController.store').middleware('auth:api')
Route.patch('products/:id', 'ProductsController.update').middleware('auth:api')
Route.delete('products/:id', 'ProductsController.destroy').middleware('auth:api')

Route.get('users', 'UsersController.index').middleware('auth:api')
Route.post('users', 'UsersController.store')
Route.post('users/auth', 'UsersController.auth')
Route.delete('users/:id', 'UsersController.destroy').middleware('auth:api')

Route.get('orders', 'OrdersController.index').middleware('auth:api')
Route.post('orders', 'OrdersController.store').middleware('auth:api')
Route.get('orders/:id', 'OrdersController.show').middleware('auth:api')
Route.get('myOrders', 'OrdersController.myIndex').middleware('auth:api')

Route.get('api/paypal/config', 'PaypalController.getClientApiCredentials').middleware('auth:api')
Route.post('api/paypal/capturePayment', 'PaypalController.captureOrder').middleware('auth:api')

Route.post('reviews', 'ReviewsController.store').middleware('auth:api')
