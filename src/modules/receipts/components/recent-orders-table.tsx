'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Receipt as ReceiptIcon, Printer } from 'lucide-react'

import { formatMoney } from '@/lib/money'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'

export interface RecentOrderRow {
  id: string
  order_no: string
  customer_name: string
  total: number
  payment_status: string
  placed_at: string
}

const columns: ColumnDef<RecentOrderRow>[] = [
  { accessorKey: 'order_no', header: 'Order No' },
  { accessorKey: 'customer_name', header: 'Customer' },
  {
    accessorKey: 'placed_at',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.placed_at), 'd MMM yyyy'),
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => <div className="text-right tabular-nums">{formatMoney(row.original.total)}</div>,
  },
  {
    accessorKey: 'payment_status',
    header: 'Payment',
    cell: ({ row }) => <StatusBadge kind="payment" value={row.original.payment_status} />,
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Print</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/print/invoice/${row.original.id}`} target="_blank" rel="noopener noreferrer">
            <ReceiptIcon className="size-4" />
            Invoice
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/print/thermal/${row.original.id}`} target="_blank" rel="noopener noreferrer">
            <Printer className="size-4" />
            Thermal
          </Link>
        </Button>
      </div>
    ),
  },
]

export function RecentOrdersTable({ orders }: { orders: RecentOrderRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      searchKey="order_no"
      searchPlaceholder="Search by order no..."
      emptyState={
        <EmptyState
          icon={ReceiptIcon}
          title="No orders yet"
          description="Orders will appear here once placed."
        />
      }
    />
  )
}
