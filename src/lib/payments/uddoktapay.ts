// UddoktaPay checkout adapter (docs/architecture.md §7 — binding contract).
// STUBBED per §13: real request/response shapes, guarded execution —
// createCharge()/verifyByInvoice() only run once payments.uddoktapay.enabled +
// api_key + base_url are configured in Settings -> Payments; otherwise both
// throw ConfigRequiredError so callers can surface a "configure this first"
// message the same way the courier adapters do.
//
// IMPORTANT: results from either function here MUST flow through
// verifyPaymentAction (src/modules/orders/actions.ts) — the only chokepoint
// allowed to flip a `payments` row to status='verified' and update
// orders.payment_status/advance_paid (docs/architecture.md §7, docs/conventions.md
// — Server actions). Never write orders/payments directly from this adapter or
// from the webhook route that calls it.
if (typeof window !== 'undefined') {
  throw new Error('src/lib/payments/uddoktapay.ts must never be imported into client-side code.')
}

import { env } from '@/lib/env'
import { ConfigRequiredError } from '@/lib/couriers/types'
import { fromPaisa, toPaisa } from '@/lib/money'
import { settingBool, settingStr } from '@/lib/settings'

interface UddoktaPayConfig {
  apiKey: string
  baseUrl: string
}

function requireUddoktaPayConfig(orgSettings: Record<string, unknown>): UddoktaPayConfig {
  const enabled = settingBool(orgSettings, 'payments.uddoktapay.enabled')
  const apiKey = settingStr(orgSettings, 'payments.uddoktapay.api_key')
  const baseUrl = settingStr(orgSettings, 'payments.uddoktapay.base_url')

  if (!enabled || !apiKey || !baseUrl) {
    throw new ConfigRequiredError('Configure UddoktaPay in Settings → Payments')
  }

  return { apiKey, baseUrl }
}

export interface CreateChargeInput {
  /** paisa */
  amount: number
  orderNo: string
  customer: { name: string; phone: string; email?: string }
  redirectUrl: string
  /**
   * Not part of UddoktaPay's own request shape — needed locally to scope the
   * webhook_url we register (api/webhooks/uddoktapay resolves the org via a
   * ?org=<id> query param, since UddoktaPay's webhook payload carries no org
   * identifier of its own).
   */
  orgId: string
}

export interface CreateChargeResult {
  paymentUrl: string
  invoiceId: string
}

/**
 * POST {base_url}/api/checkout-v2 — UddoktaPay's real checkout-v2 request
 * shape. Returns a hosted payment_url to redirect the customer to; the
 * resulting invoice is confirmed later via the webhook or verifyByInvoice().
 */
export async function createCharge(
  orgSettings: Record<string, unknown>,
  input: CreateChargeInput,
): Promise<CreateChargeResult> {
  const config = requireUddoktaPayConfig(orgSettings)

  const res = await fetch(`${config.baseUrl}/api/checkout-v2`, {
    method: 'POST',
    headers: {
      'RT-UDDOKTAPAY-API-KEY': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      full_name: input.customer.name,
      email: input.customer.email || 'guest@scarpar.app',
      amount: fromPaisa(input.amount).toFixed(2),
      metadata: { order_no: input.orderNo },
      redirect_url: input.redirectUrl,
      cancel_url: input.redirectUrl,
      webhook_url: `${env.APP_URL}/api/webhooks/uddoktapay?org=${encodeURIComponent(input.orgId)}`,
    }),
  })

  if (!res.ok) {
    throw new Error(`UddoktaPay checkout-v2 failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { payment_url?: string; invoice_id?: string }
  if (!data.payment_url || !data.invoice_id) {
    throw new Error('UddoktaPay checkout-v2 returned no payment_url/invoice_id')
  }

  return { paymentUrl: data.payment_url, invoiceId: data.invoice_id }
}

export interface VerifyByInvoiceResult {
  status: 'COMPLETED' | 'PENDING' | 'ERROR'
  /** paisa */
  amount: number
  trxId?: string
}

/** POST {base_url}/api/verify-payment {invoice_id} — UddoktaPay's real verify shape. */
export async function verifyByInvoice(
  orgSettings: Record<string, unknown>,
  invoiceId: string,
): Promise<VerifyByInvoiceResult> {
  const config = requireUddoktaPayConfig(orgSettings)

  const res = await fetch(`${config.baseUrl}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'RT-UDDOKTAPAY-API-KEY': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invoice_id: invoiceId }),
  })

  if (!res.ok) {
    throw new Error(`UddoktaPay verify-payment failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as {
    status?: string
    amount?: string | number
    transaction_id?: string
  }

  const status: VerifyByInvoiceResult['status'] =
    data.status === 'COMPLETED' || data.status === 'PENDING' ? data.status : 'ERROR'

  return {
    status,
    amount: toPaisa(data.amount ?? 0),
    trxId: data.transaction_id,
  }
}
