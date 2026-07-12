// SHARED DISCOUNT-VALIDATION CONTRACT — consumed by the orders and storefront
// slices at manual-order creation / storefront checkout. The discounts slice
// OWNS and implements this file; other slices import it read-only.
//
// Not `import 'server-only'`: that package isn't in package.json and
// conventions.md forbids new deps (see src/lib/supabase/admin.ts and
// src/modules/orders/create-order.ts for the same reasoning) — this inline
// guard has the identical effect.
if (typeof window !== 'undefined') {
  throw new Error(
    'src/modules/discounts/validate.ts (service-role discount validation) must never be imported into client-side code.',
  )
}

import { formatMoney } from '@/lib/money'
import { getAdminClient } from '@/lib/supabase/admin'
import type { Discount } from '@/types/db'

export type DiscountValidationResult =
  | { ok: true; discountId: string; amount: number; label: string }
  | { ok: false; reason: string }

/**
 * Validates a discount code against org scoping, active window, usage cap,
 * minimum order, and product/category scope — WITHOUT mutating used_count.
 * Uses the service-role client so it works from unauthenticated storefront
 * checkout as well as authenticated admin/POS order creation.
 *
 * `productIds`/`categoryIds` are the ids present in the cart/order being
 * priced (used only for scope='products'/'categories' matching).
 *
 * Callers MUST call `consumeDiscount(discountId)` themselves, once, right
 * after the order row that redeems this code is successfully inserted — see
 * that function's JSDoc for why this is a separate step.
 */
export async function validateDiscountCode(
  orgId: string,
  code: string,
  subtotalPaisa: number,
  productIds: string[],
  categoryIds: string[],
): Promise<DiscountValidationResult> {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode) return { ok: false, reason: 'Enter a discount code.' }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('org_id', orgId)
    .eq('code', normalizedCode)
    .single()

  if (error || !data) return { ok: false, reason: 'This discount code is not valid.' }
  const discount = data as Discount

  if (!discount.is_active) return { ok: false, reason: 'This discount code is no longer active.' }

  const now = Date.now()
  if (discount.starts_at && now < new Date(discount.starts_at).getTime()) {
    return { ok: false, reason: 'This discount code is not active yet.' }
  }
  if (discount.expires_at && now > new Date(discount.expires_at).getTime()) {
    return { ok: false, reason: 'This discount code has expired.' }
  }

  if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
    return { ok: false, reason: 'This discount code has reached its usage limit.' }
  }

  if (discount.min_order > 0 && subtotalPaisa < discount.min_order) {
    return { ok: false, reason: `This code requires a minimum order of ${formatMoney(discount.min_order)}.` }
  }

  if (discount.scope === 'products') {
    const allowed = new Set(discount.product_ids ?? [])
    if (!productIds.some((id) => allowed.has(id))) {
      return { ok: false, reason: "This code doesn't apply to any item in your cart." }
    }
  } else if (discount.scope === 'categories') {
    const allowed = new Set(discount.category_ids ?? [])
    if (!categoryIds.some((id) => allowed.has(id))) {
      return { ok: false, reason: "This code doesn't apply to any item in your cart." }
    }
  }

  let amount = 0
  let label = discount.title

  if (discount.type === 'percent') {
    const percent = discount.value ?? 0
    amount = Math.round((subtotalPaisa * percent) / 100)
    label = `${percent}% off`
  } else if (discount.type === 'fixed') {
    const fixed = discount.value ?? 0
    amount = Math.min(fixed, subtotalPaisa)
    label = `${formatMoney(fixed)} off`
  } else {
    amount = 0
    label = 'Free shipping'
  }

  return { ok: true, discountId: discount.id, amount, label }
}

/**
 * Increments discounts.used_count by 1. Callers (order-creation code in the
 * orders/storefront slices) MUST call this once, right after the order row
 * that redeemed the code is successfully inserted — never before, so a
 * failed/abandoned checkout doesn't burn a use.
 *
 * Read-then-write, not atomic: no DB increment function exists in the
 * migrations for this yet. Fine at v1 traffic; under heavy concurrent
 * redemptions of the same code this can under-count by a small margin. If
 * that ever matters, add a SECURITY DEFINER SQL function and swap the body
 * for an `.rpc()` call — this exported signature would not need to change.
 */
export async function consumeDiscount(discountId: string): Promise<void> {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('discounts')
      .select('used_count')
      .eq('id', discountId)
      .single()

    if (error || !data) {
      console.error('[consumeDiscount] discount not found', discountId, error)
      return
    }

    const { error: updateError } = await supabase
      .from('discounts')
      .update({ used_count: (data as { used_count: number }).used_count + 1 })
      .eq('id', discountId)

    if (updateError) console.error('[consumeDiscount] update failed', discountId, updateError)
  } catch (err) {
    console.error('[consumeDiscount] threw', discountId, err)
  }
}
