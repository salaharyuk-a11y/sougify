'use client'

import { format } from 'date-fns'
import { Building2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { OrgActiveSwitch } from './org-active-switch'

export interface PlatformOrgRow {
  id: string
  name: string
  slug: string
  vertical: string
  plan: string
  membersCount: number
  ordersCount: number
  createdAt: string
  isActive: boolean
}

function OrgsTable({ orgs }: { orgs: PlatformOrgRow[] }) {
  if (orgs.length === 0) {
    return <EmptyState icon={Building2} title="No organizations yet" />
  }

  const columns: ColumnDef<PlatformOrgRow>[] = [
    {
      accessorKey: 'name',
      header: 'Organization',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.slug}</span>
        </div>
      ),
    },
    {
      accessorKey: 'vertical',
      header: 'Vertical',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.vertical}
        </Badge>
      ),
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => <span className="capitalize">{row.original.plan}</span>,
    },
    {
      accessorKey: 'membersCount',
      header: 'Members',
      cell: ({ row }) => <span className="tabular-nums">{row.original.membersCount}</span>,
    },
    {
      accessorKey: 'ordersCount',
      header: 'Orders',
      cell: ({ row }) => <span className="tabular-nums">{row.original.ordersCount}</span>,
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {format(new Date(row.original.createdAt), 'd MMM yyyy')}
        </span>
      ),
    },
    {
      id: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <OrgActiveSwitch orgId={row.original.id} isActive={row.original.isActive} />
      ),
    },
  ]

  return (
    <DataTable columns={columns} data={orgs} searchKey="name" searchPlaceholder="Search organizations..." />
  )
}

export { OrgsTable }
