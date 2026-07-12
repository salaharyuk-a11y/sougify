// Fraud-check adapter contract (docs/architecture.md §7 — binding contract).
// STUBBED per §13: real interface + config UI, guarded execution.
//
// Unlike the payment/courier adapters, checkCustomerRisk() below is designed to
// NEVER throw — a fraud signal is advisory input into the order-create flow
// (docs/architecture.md §7: "check blocklist -> flag risk_level high + settings
// action"), not a hard dependency. Any misconfiguration, disabled provider, or
// adapter failure is logged and resolved to `null` so the caller always has a
// safe fallback: treat as unknown risk, never block checkout on a fraud-provider
// outage.
if (typeof window !== 'undefined') {
  throw new Error('src/lib/fraud/provider.ts must never be imported into client-side code.')
}

import { settingBool, settingStr } from '@/lib/settings'

export interface FraudCheckResult {
  /** 0-100 — this phone's historical successful-delivery rate. */
  successRate: number
  riskLevel: 'low' | 'medium' | 'high'
  totalOrders?: number
  provider: string
}

export interface FraudProvider {
  key: string
  checkPhone(phone: string): Promise<FraudCheckResult>
}

/**
 * FraudBD stub — no publicly documented request/response shape to build
 * against yet, so this adapter is guarded-but-unimplemented: it throws so the
 * checkCustomerRisk() wrapper below always catches it and returns null until a
 * real integration lands. Keeps the FraudProvider contract in place so wiring
 * a real call later is a one-function change, not a new interface.
 */
const fraudbdProvider: FraudProvider = {
  key: 'fraudbd',
  async checkPhone(): Promise<FraudCheckResult> {
    throw new Error('FraudBD live lookup is not implemented yet.')
  },
}

const PROVIDERS: Record<string, FraudProvider> = {
  fraudbd: fraudbdProvider,
}

/**
 * Order-create call site helper. Reads `fraud.enabled` + `fraud.provider` from
 * org settings, runs the matching adapter, and never throws. The caller is
 * responsible for mapping a non-null result's `riskLevel` to the
 * `fraud.high_risk_action` setting:
 *   - 'high'   + high_risk_action='block'                -> reject order placement
 *   - 'high'   + high_risk_action='require_full_advance' -> force full advance payment
 *   - 'high'   + high_risk_action='flag'                 -> set orders.risk_level, allow through
 *   - 'medium'/'low' -> set orders.risk_level for visibility only, no gating
 * A `null` result (disabled/unconfigured/errored) means: skip fraud gating entirely.
 */
export async function checkCustomerRisk(
  orgSettings: Record<string, unknown>,
  phone: string,
): Promise<FraudCheckResult | null> {
  try {
    const enabled = settingBool(orgSettings, 'fraud.enabled')
    const providerKey = settingStr(orgSettings, 'fraud.provider')
    if (!enabled || !providerKey || providerKey === 'disabled') return null

    const provider = PROVIDERS[providerKey]
    if (!provider) return null

    return await provider.checkPhone(phone)
  } catch (err) {
    console.error('[checkCustomerRisk] fraud provider lookup failed', err)
    return null
  }
}
