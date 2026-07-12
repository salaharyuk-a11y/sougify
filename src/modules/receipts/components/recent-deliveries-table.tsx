'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { Tag, Truck } from 'lucide-react'

import { formatMoney } from '@/lib/money'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'

export interface RecentDeliveryRow {
  id: string
  delivery_no: string
  recipient_name: string | null
  cod_amount: number
  status: string
}

const columns: ColumnDef<RecentDeliveryRow>[] = [
  { accessorKey: 'delivery_no', header: 'Delivery No' },
  {
    accessorKey: 'recipient_name',
    header: 'Recipient',
    cell: ({ row }) => row.original.recipient_name || '—',
  },
  {
    accessorKey: 'cod_amount',
    header: () => <div className="text-right">COD</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.cod_amount > 0 ? formatMoney(row.original.cod_amount) : '—'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge kind="delivery" value={row.original.status} />,
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Print</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/print/label/${row.original.id}`} target="_blank" rel="noopener noreferrer">
            <Tag className="size-4" />
            Label
          </Link>
        </Button>
      </div>
    ),
  },
]

export function RecentDeliveriesTable({ deliveries }: { deliveries: RecentDeliveryRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={deliveries}
      searchKey="delivery_no"
      searchPlaceholder="Search by delivery no..."
      emptyState={
        <EmptyState
          icon={Truck}
          title="No deliveries yet"
          description="Deliveries will appear here once created."
        />
      }
    />
  )
}
