import { Clock, MapPin, PackageCheck, Truck, XCircle } from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"

interface DeliveryStatsProps {
  pending: number
  assigned: number
  inTransit: number
  deliveredToday: number
  failed: number
}

/** StatCards row for the deliveries list page (docs/architecture.md dashboard widgets). */
function DeliveryStats({ pending, assigned, inTransit, deliveredToday, failed }: DeliveryStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Pending" value={pending} icon={Clock} />
      <StatCard label="Assigned" value={assigned} icon={MapPin} />
      <StatCard label="In Transit" value={inTransit} icon={Truck} />
      <StatCard label="Delivered Today" value={deliveredToday} icon={PackageCheck} />
      <StatCard label="Failed" value={failed} icon={XCircle} />
    </div>
  )
}

export { DeliveryStats }
