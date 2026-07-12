import { Clock, Percent, Truck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { StatCard } from '@/components/ui/stat-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CodDistrictRow, DeliveryPerformanceResult } from '@/modules/reports/queries'

interface DeliveryTabProps {
  performance: DeliveryPerformanceResult
  codByDistrict: CodDistrictRow[]
}

function rateVariant(rate: number): 'success' | 'warning' | 'destructive' {
  if (rate >= 90) return 'success'
  if (rate >= 70) return 'warning'
  return 'destructive'
}

function DeliveryTab({ performance, codByDistrict }: DeliveryTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Avg. delivery time"
          value={performance.avgHours !== null ? `${performance.avgHours.toFixed(1)}h` : '—'}
          icon={Clock}
          hint="Assigned to delivered"
        />
        <StatCard
          label="Failure rate"
          value={`${performance.failureRate.toFixed(1)}%`}
          icon={Percent}
          hint="Of delivered + failed"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-foreground">COD success by district</p>
        {codByDistrict.length === 0 ? (
          <EmptyState icon={Truck} title="No deliveries in this range" />
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead className="text-right">Success rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codByDistrict.map((row) => (
                  <TableRow key={row.district}>
                    <TableCell className="font-medium">{row.district}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.delivered}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.failed}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={rateVariant(row.rate)}>{row.rate.toFixed(0)}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-foreground">By rider</p>
          {performance.byRider.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">No rider deliveries in this range.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rider</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Failed</TableHead>
                    <TableHead className="text-right">Avg. hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.byRider.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.delivered}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.failed}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.avgHours !== null ? row.avgHours.toFixed(1) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-foreground">By courier</p>
          {performance.byCourier.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">No courier deliveries in this range.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Courier</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Failed</TableHead>
                    <TableHead className="text-right">Avg. hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.byCourier.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium capitalize">{row.label}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.delivered}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.failed}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.avgHours !== null ? row.avgHours.toFixed(1) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { DeliveryTab }
