import { faker } from '@faker-js/faker'

export default function getRandomAdminData() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isAdmin: true,
  }
}
