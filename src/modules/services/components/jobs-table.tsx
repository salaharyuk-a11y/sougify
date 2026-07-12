'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTable } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatMoney } from '@/lib/money'

import type { JobListRow } from '../schemas'

interface JobsTableProps {
  jobs: JobListRow[]
}

function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter()

  const columns = useMemo<ColumnDef<JobListRow>[]>(
    () => [
      { accessorKey: 'job_no', header: 'Job #' },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <span className="text-foreground font-medium">{row.original.title}</span>,
      },
      {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.customer?.name ?? 'Unknown'}</span>
            <span className="text-muted-foreground text-xs">{row.original.customer?.phone ?? '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'scheduled_at',
        header: 'Scheduled',
        cell: ({ row }) =>
          row.original.scheduled_at ? format(new Date(row.original.scheduled_at), 'd MMM, h:mm a') : '—',
      },
      {
        id: 'assigned_to',
        header: 'Assigned to',
        cell: ({ row }) =>
          row.original.assigned_to_name ? (
            row.original.assigned_to_name
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          ),
      },
      {
        id: 'amount',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = row.original.final_amount ?? row.original.quote_amount
          return (
            <div className="text-right tabular-nums">
              {amount != null ? formatMoney(amount) : '—'}
              {row.original.final_amount != null ? (
                <span className="text-muted-foreground ml-1 text-xs">(final)</span>
              ) : row.original.quote_amount != null ? (
                <span className="text-muted-foreground ml-1 text-xs">(quote)</span>
              ) : null}
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge kind="job" value={row.original.status} />,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={jobs}
      searchKey="title"
      searchPlaceholder="Search jobs..."
      onRowClick={(job) => router.push(`/admin/services/${job.id}`)}
    />
  )
}

export { JobsTable }
