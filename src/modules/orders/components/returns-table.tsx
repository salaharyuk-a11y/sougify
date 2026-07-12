'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Undo2 } from 'lucide-react'

import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatMoney } from '@/lib/money'

export interface ReturnRow {
  id: string
  return_no: string
  order_id: string
  order_no: string
  status: string
  resolution: string | null
  refund_amount: number | null
  created_at: string
}

interface ReturnsTableProps {
  data: ReturnRow[]
}

function ReturnsTable({ data }: ReturnsTableProps) {
  const router = useRouter()

  const columns = React.useMemo<ColumnDef<ReturnRow>[]>(
    () => [
      {
        accessorKey: 'return_no',
        header: 'Return',
        cell: ({ row }) => <span className="font-medium">{row.original.return_no}</span>,
      },
      {
        id: 'order',
        header: 'Order',
        cell: ({ row }) => (
          <Link
            href={`/admin/orders/${row.original.order_id}`}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.order_no}
          </Link>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge kind="return" value={row.original.status} />,
      },
      {
        accessorKey: 'resolution',
        header: 'Resolution',
        cell: ({ row }) => (
          <span className="text-muted-foreground capitalize">{row.original.resolution?.replace('_', ' ') ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'refund_amount',
        header: 'Refund',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.refund_amount != null ? formatMoney(row.original.refund_amount) : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => format(new Date(row.original.created_at), 'd MMM yyyy, h:mm a'),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={50}
      onRowClick={(row) => router.push(`/admin/returns/${row.id}`)}
      emptyState={<EmptyState icon={Undo2} title="No returns yet" description="Returns created from an order will show up here." />}
    />
  )
}

export { ReturnsTable }
