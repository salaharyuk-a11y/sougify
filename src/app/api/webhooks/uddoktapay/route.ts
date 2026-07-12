// UddoktaPay webhook receiver (docs/architecture.md §1/§7 route map — "stubs,
// signature-verify pattern"). UddoktaPay authenticates webhooks with the same
// static RT-UDDOKTAPAY-API-KEY header used for outbound requests (no HMAC),
// checked here against the org's configured payments.uddoktapay.api_key.
//
// Guarded stub: on a verified request this logs the payload and returns 200.
// Wiring the payload into a real payment update is a follow-up — it MUST go
// through verifyPaymentAction (src/modules/orders/actions.ts), the only
// chokepoint allowed to flip `payments`.status -> 'verified' and update
// orders.payment_status/advance_paid. Never write orders/payments directly
// from a webhook handler.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getOrgSettings, settingStr } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const orgId = new URL(request.url).searchParams.get('org')
    if (!orgId) {
      return NextResponse.json({ error: 'Missing org' }, { status: 400 })
    }

    const settings = await getOrgSettings(orgId)
    const configuredKey = settingStr(settings, 'payments.uddoktapay.api_key')
    const receivedKey = request.headers.get('RT-UDDOKTAPAY-API-KEY')

    if (!configuredKey || !receivedKey || receivedKey !== configuredKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    console.log('[webhooks/uddoktapay] verified payload', { orgId, payload })

    // TODO: resolve the order from payload.metadata.order_no, find (or insert)
    // the matching `payments` row, then call verifyPaymentAction(paymentId) —
    // never update orders/payments directly from here.

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhooks/uddoktapay] failed', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
