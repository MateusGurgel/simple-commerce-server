import { ResponseContract } from '@ioc:Adonis/Core/Response'

interface Error {
  rule?: string
  field?: string
  message: string
}

export default class ApiResponse {
  public static error(response: ResponseContract, status: number, errors: Error[]) {
    return response.status(status).json({
      errors,
    })
  }
}
