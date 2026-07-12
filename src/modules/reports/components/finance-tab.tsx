import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MiniBarChart } from '@/components/ui/mini-chart'
import { formatMoney } from '@/lib/money'
import type { ExpenseCategoryRow, PnlResult } from '@/modules/reports/queries'

import { ExportButton } from './export-button'

interface FinanceTabProps {
  pnl: PnlResult
  expensesByCategory: ExpenseCategoryRow[]
  from: string
  to: string
}

function FinanceTab({ pnl, expensesByCategory, from, to }: FinanceTabProps) {
  const rows: { label: string; value: number; emphasis?: boolean }[] = [
    { label: 'Revenue', value: pnl.revenue },
    { label: 'COGS', value: -pnl.cogs },
    { label: 'Expenses', value: -pnl.expenses },
    { label: 'Net', value: pnl.net, emphasis: true },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Profit &amp; loss</CardTitle>
          <ExportButton report="mushak" from={from} to={to} label="Export Mushak 6.2" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b py-2 last:border-0">
              <span
                className={
                  row.emphasis ? 'text-[13px] font-semibold text-foreground' : 'text-[13px] text-muted-foreground'
                }
              >
                {row.label}
              </span>
              <span
                className={
                  row.emphasis
                    ? 'text-[14px] font-semibold tabular-nums text-foreground'
                    : 'text-[13px] tabular-nums text-foreground'
                }
              >
                {formatMoney(row.value)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-[13px] font-medium text-foreground">Expenses by category</p>
        {expensesByCategory.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">No expenses recorded in this range.</p>
        ) : (
          <MiniBarChart
            data={expensesByCategory.map((c) => ({ label: c.category, value: c.total }))}
            formatValue={(v) => formatMoney(v)}
            height={160}
          />
        )}
      </div>
    </div>
  )
}

export { FinanceTab }
