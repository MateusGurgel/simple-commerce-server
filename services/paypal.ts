import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'
const PAYPAL_API = Env.get('PAYPAL_API')
const PAYPAL_SECRET = Env.get('PAYPAL_SECRET')
const PAYPAL_CLIENT_ID = Env.get('PAYPAL_CLIENT_ID')

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64')
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

export async function createOrder(purchaseAmount: string) {
  const accessToken = await generateAccessToken()
  const url = `${PAYPAL_API}/v2/checkout/orders`
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: purchaseAmount,
          },
        },
      ],
    }),
  })

  return handleResponse(response)
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}
