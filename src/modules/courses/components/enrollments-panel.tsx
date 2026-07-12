'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Users } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'

import { revokeEnrollment } from '../actions'
import type { EnrollmentRow } from '../schemas'
import { EnrollCustomerDialog } from './enroll-customer-dialog'

interface EnrollmentsPanelProps {
  courseId: string
  enrollments: EnrollmentRow[]
}

function EnrollmentsPanel({ courseId, enrollments }: EnrollmentsPanelProps) {
  async function handleRevoke(enrollmentId: string) {
    const result = await revokeEnrollment(enrollmentId, courseId)
    if (result.ok) toast.success('Enrollment revoked')
    else toast.error(result.error)
  }

  const columns = useMemo<ColumnDef<EnrollmentRow>[]>(
    () => [
      {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-foreground font-medium">{row.original.customer?.name ?? 'Unknown'}</span>
            <span className="text-muted-foreground text-xs">{row.original.customer?.phone ?? '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge kind="enrollment" value={row.original.status} />,
      },
      {
        accessorKey: 'enrolled_at',
        header: 'Enrolled',
        cell: ({ row }) => format(new Date(row.original.enrolled_at), 'd MMM yyyy'),
      },
      {
        id: 'progress',
        header: () => <div className="text-right">Progress</div>,
        cell: ({ row }) => {
          const pct = Number((row.original.progress as { percent?: number })?.percent ?? 0)
          return <div className="text-right tabular-nums">{pct}%</div>
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) =>
          row.original.status === 'active' ? (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              }
              title="Revoke enrollment?"
              description="The customer will lose access to this course."
              confirmLabel="Revoke"
              destructive
              onConfirm={() => handleRevoke(row.original.id)}
            />
          ) : null,
      },
    ],
    [courseId],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <EnrollCustomerDialog courseId={courseId} />
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments yet"
          description="Enroll a customer to give them access to this course."
        />
      ) : (
        <DataTable columns={columns} data={enrollments} />
      )}
    </div>
  )
}

export { EnrollmentsPanel }
