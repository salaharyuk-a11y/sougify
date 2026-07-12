import { fromPaisa } from '@/lib/money'
import { ConfigRequiredError, requireCourierConfig } from './types'
import type { CourierAdapter, CourierOrderInput, CourierOrderResult, CourierStatusResult } from './types'

// Real Pathao Courier ("Aladdin") API v1 (docs/architecture.md §8). STUBBED per
// §13: real request/response shapes, guarded execution.
const BASE_URL = 'https://api-hermes.pathao.com'

interface PathaoConfig {
  client_id?: string
  client_secret?: string
  username?: string
  password?: string
  store_id?: string | number
  /** Pathao's own city/zone ids — org configures these once for its warehouse. */
  city_id?: string | number
  zone_id?: string | number
}

interface PathaoTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

/**
 * OAuth password-grant token fetch. v1 has no cross-request cache (a fresh
 * token per call) — fine at this volume; a real deployment would cache by
 * org_id keyed on expires_in.
 */
async function issueToken(config: PathaoConfig): Promise<string> {
  if (!config.client_id || !config.client_secret || !config.username || !config.password) {
    throw new ConfigRequiredError('Configure Pathao API credentials in courier settings')
  }

  const res = await fetch(`${BASE_URL}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.client_id,
      client_secret: config.client_secret,
      username: config.username,
      password: config.password,
      grant_type: 'password',
    }),
  })

  if (!res.ok) {
    throw new Error(`Pathao issue-token failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as PathaoTokenResponse
  return data.access_token
}

export const pathaoAdapter: CourierAdapter = {
  key: 'pathao',

  async createOrder(ctx, input: CourierOrderInput): Promise<CourierOrderResult> {
    const config = (await requireCourierConfig(ctx, 'pathao', 'Pathao')) as PathaoConfig
    if (!config.store_id || !config.city_id || !config.zone_id) {
      throw new ConfigRequiredError('Configure Pathao store/city/zone in courier settings')
    }

    const token = await issueToken(config)

    const res = await fetch(`${BASE_URL}/aladdin/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        store_id: config.store_id,
        merchant_order_id: input.orderNo,
        recipient_name: input.recipientName,
        recipient_phone: input.recipientPhone,
        recipient_address: input.recipientAddress,
        recipient_city: config.city_id,
        recipient_zone: config.zone_id,
        delivery_type: 48, // normal delivery
        item_type: 2, // parcel
        special_instruction: input.note ?? '',
        item_quantity: 1,
        item_weight: 0.5,
        amount_to_collect: Math.round(fromPaisa(input.codAmount)),
        item_description: `Order ${input.orderNo}`,
      }),
    })

    if (!res.ok) {
      throw new Error(`Pathao create order failed: ${res.status} ${await res.text()}`)
    }

    const data = (await res.json()) as { data?: { consignment_id: string } }
    if (!data.data?.consignment_id) {
      throw new Error('Pathao create order returned no consignment_id')
    }

    // Pathao has no separate customer-facing tracking code — consignment_id IS
    // the tracking reference on their own tracking page.
    return { consignmentId: data.data.consignment_id, trackingCode: data.data.consignment_id }
  },

  async getStatus(ctx, consignmentId: string): Promise<CourierStatusResult> {
    const config = (await requireCourierConfig(ctx, 'pathao', 'Pathao')) as PathaoConfig
    const token = await issueToken(config)

    const res = await fetch(`${BASE_URL}/aladdin/api/v1/orders/${encodeURIComponent(consignmentId)}/info`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error(`Pathao status lookup failed: ${res.status} ${await res.text()}`)
    }

    const data = (await res.json()) as { data?: { order_status?: string } }
    return { status: data.data?.order_status ?? 'unknown', raw: data }
  },
}
