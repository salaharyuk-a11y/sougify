import { fromPaisa } from '@/lib/money'
import { ConfigRequiredError, requireCourierConfig } from './types'
import type { CourierAdapter, CourierOrderInput, CourierOrderResult, CourierStatusResult } from './types'

// Real Steadfast Courier API v1 (docs/architecture.md §8). STUBBED per §13: real
// request/response shapes, guarded execution — never called until an org
// activates a courier_accounts row with real keys.
const BASE_URL = 'https://portal.steadfast.com.bd/api/v1'

interface SteadfastConfig {
  api_key?: string
  secret_key?: string
}

function authHeaders(config: SteadfastConfig): HeadersInit {
  if (!config.api_key || !config.secret_key) {
    throw new ConfigRequiredError('Configure Steadfast API keys in courier settings')
  }
  return {
    'Content-Type': 'application/json',
    'Api-Key': config.api_key,
    'Secret-Key': config.secret_key,
  }
}

export const steadfastAdapter: CourierAdapter = {
  key: 'steadfast',

  async createOrder(ctx, input: CourierOrderInput): Promise<CourierOrderResult> {
    const config = (await requireCourierConfig(ctx, 'steadfast', 'Steadfast')) as SteadfastConfig
    const headers = authHeaders(config)

    const res = await fetch(`${BASE_URL}/create_order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        invoice: input.orderNo,
        recipient_name: input.recipientName,
        recipient_phone: input.recipientPhone,
        recipient_address: input.recipientAddress,
        cod_amount: Math.round(fromPaisa(input.codAmount)), // Steadfast wants whole taka
        note: input.note ?? '',
      }),
    })

    if (!res.ok) {
      throw new Error(`Steadfast create_order failed: ${res.status} ${await res.text()}`)
    }

    const data = (await res.json()) as {
      consignment?: { consignment_id: number | string; tracking_code: string }
    }
    if (!data.consignment) {
      throw new Error('Steadfast create_order returned no consignment')
    }

    return {
      consignmentId: String(data.consignment.consignment_id),
      trackingCode: data.consignment.tracking_code,
    }
  },

  async getStatus(ctx, consignmentId: string): Promise<CourierStatusResult> {
    const config = (await requireCourierConfig(ctx, 'steadfast', 'Steadfast')) as SteadfastConfig
    const headers = authHeaders(config)

    const res = await fetch(`${BASE_URL}/status_by_cid/${encodeURIComponent(consignmentId)}`, {
      headers,
    })

    if (!res.ok) {
      throw new Error(`Steadfast status lookup failed: ${res.status} ${await res.text()}`)
    }

    const data = (await res.json()) as { delivery_status?: string }
    return { status: data.delivery_status ?? 'unknown', raw: data }
  },
}
