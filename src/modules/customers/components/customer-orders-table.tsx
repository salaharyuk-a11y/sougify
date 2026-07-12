'use client'

import * as React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'

import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatMoney } from '@/lib/money'
import type { Order } from '@/types/db'

export type CustomerOrderRow = Pick<Order, 'id' | 'order_no' | 'placed_at' | 'total' | 'status' | 'payment_status'>

export function CustomerOrdersTable({ orders }: { orders: CustomerOrderRow[] }) {
  const columns = React.useMemo<ColumnDef<CustomerOrderRow>[]>(
    () => [
      {
        accessorKey: 'order_no',
        header: 'Order',
        cell: ({ row }) => (
          <Link href={`/admin/orders/${row.original.id}`} className="text-primary font-medium hover:underline">
            {row.original.order_no}
          </Link>
        ),
      },
      {
        accessorKey: 'placed_at',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.placed_at), 'd MMM yyyy'),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.total)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge kind="order" value={row.original.status} />,
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment',
        cell: ({ row }) => <StatusBadge kind="payment" value={row.original.payment_status} />,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={orders}
      emptyState={
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="Orders from this customer will show up here."
        />
      }
    />
  )
}
