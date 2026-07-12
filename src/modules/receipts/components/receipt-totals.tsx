import { formatMoney } from '@/lib/money'

// Shared print template component — print.css scopes `.receipt-totals .row` /
// `.row--total` under both `.print-a4` and `.print-thermal`, so this same markup
// renders correctly (just differently styled) on both formats.

export interface ReceiptTotalsRow {
  label: string
  amountPaisa: number
}

export interface ReceiptTotalsProps {
  subtotalPaisa: number
  discountPaisa?: number
  discountCode?: string | null
  deliveryChargePaisa?: number
  /** Extra rows between delivery and the total line — e.g. a VAT row per settings.tax.mode. */
  taxRows?: ReceiptTotalsRow[]
  totalPaisa: number
  /** When > 0, also renders "Advance Paid" (negative) and "Balance Due" rows. */
  advancePaidPaisa?: number
}

export function ReceiptTotals({
  subtotalPaisa,
  discountPaisa = 0,
  discountCode,
  deliveryChargePaisa = 0,
  taxRows = [],
  totalPaisa,
  advancePaidPaisa = 0,
}: ReceiptTotalsProps) {
  const balanceDue = Math.max(totalPaisa - advancePaidPaisa, 0)

  return (
    <div className="receipt-totals">
      <div className="row">
        <span>Subtotal</span>
        <span>{formatMoney(subtotalPaisa)}</span>
      </div>

      {discountPaisa > 0 ? (
        <div className="row">
          <span>Discount{discountCode ? ` (${discountCode})` : ''}</span>
          <span>-{formatMoney(discountPaisa)}</span>
        </div>
      ) : null}

      {deliveryChargePaisa > 0 ? (
        <div className="row">
          <span>Delivery</span>
          <span>{formatMoney(deliveryChargePaisa)}</span>
        </div>
      ) : null}

      {taxRows.map((row) => (
        <div className="row" key={row.label}>
          <span>{row.label}</span>
          <span>{formatMoney(row.amountPaisa)}</span>
        </div>
      ))}

      <div className="row row--total">
        <span>Total</span>
        <span>{formatMoney(totalPaisa)}</span>
      </div>

      {advancePaidPaisa > 0 ? (
        <>
          <div className="row">
            <span>Advance Paid</span>
            <span>-{formatMoney(advancePaidPaisa)}</span>
          </div>
          <div className="row">
            <span>Balance Due</span>
            <span>{formatMoney(balanceDue)}</span>
          </div>
        </>
      ) : null}
    </div>
  )
}
