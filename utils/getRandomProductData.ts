import { faker } from '@faker-js/faker'

export default function getRandomProductData() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg',
    price: +faker.commerce.price(),
    brand: faker.company.name(),
    category: 'Test Product!',
    countInStock: +faker.random.numeric(2),
    rate: 0,
  }
}
