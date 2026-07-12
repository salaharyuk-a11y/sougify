import { Landmark, PiggyBank, Wallet } from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { formatMoney } from "@/lib/money"

interface CodSummaryProps {
  uncollectedInField: number
  withRiders: number
  settledThisMonth: number
}

/** Top StatCards row for the COD reconciliation page. */
function CodSummary({ uncollectedInField, withRiders, settledThisMonth }: CodSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Uncollected COD (in field)" value={formatMoney(uncollectedInField)} icon={Wallet} />
      <StatCard label="Cash with riders" value={formatMoney(withRiders)} icon={PiggyBank} />
      <StatCard label="Settled this month" value={formatMoney(settledThisMonth)} icon={Landmark} />
    </div>
  )
}

export { CodSummary }
