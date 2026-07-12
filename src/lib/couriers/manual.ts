import { randomKey } from '@/lib/utils'
import type { CourierAdapter, CourierOrderInput, CourierOrderResult, CourierStatusResult } from './types'

/**
 * Manual courier "adapter" — the always-available default (docs/architecture.md
 * §8: "fully working"). There is no external API: the admin books the courier
 * themselves (phone/counter/portal) and types the resulting tracking code into
 * the new-delivery form. A blank code still gets a local reference so the
 * delivery/label always has something to print and track by.
 */
export const manualAdapter: CourierAdapter = {
  key: 'manual',

  async createOrder(_ctx, input: CourierOrderInput): Promise<CourierOrderResult> {
    const trackingCode = input.manualTrackingCode?.trim() || `MAN-${randomKey(8).toUpperCase()}`
    return { consignmentId: trackingCode, trackingCode }
  },

  async getStatus(_ctx, consignmentId: string): Promise<CourierStatusResult> {
    // No external status source — the admin drives status via the delivery
    // stepper themselves (src/modules/delivery/actions.ts markXAction calls).
    return { status: 'unknown', raw: { consignmentId } }
  },
}
