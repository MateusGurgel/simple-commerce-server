import { faker } from '@faker-js/faker'

export default function getRandomProductData() {
  return {
    name: faker.commerce.productName(),
    price: +faker.commerce.price(),
    image: 'image',
    brand: faker.company.name(),
    category: 'Test Product!',
    description: faker.commerce.productDescription(),
    countInStock: +faker.random.numeric(2),
  }
}
