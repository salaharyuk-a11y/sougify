'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { BadgePercent } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Switch } from '@/components/ui/switch'
import { formatMoney } from '@/lib/money'
import type { Discount } from '@/types/db'

import { toggleDiscountActive } from '../actions'

const TYPE_LABEL: Record<Discount['type'], string> = {
  percent: 'Percent',
  fixed: 'Fixed amount',
  free_shipping: 'Free shipping',
}

const SCOPE_LABEL: Record<Discount['scope'], string> = {
  all: 'All products',
  products: 'Products',
  categories: 'Categories',
}

function valueLabel(discount: Discount): string {
  if (discount.type === 'percent') return `${discount.value ?? 0}%`
  if (discount.type === 'fixed') return formatMoney(discount.value ?? 0)
  return '—'
}

function windowLabel(discount: Discount): string {
  const parts: string[] = []
  if (discount.starts_at) parts.push(format(new Date(discount.starts_at), 'd MMM yyyy'))
  if (discount.expires_at) parts.push(format(new Date(discount.expires_at), 'd MMM yyyy'))
  return parts.length > 0 ? parts.join(' – ') : 'No end date'
}

function DiscountActiveSwitch({ id, isActive }: { id: string; isActive: boolean }) {
  const [checked, setChecked] = React.useState(isActive)
  const [pending, startTransition] = React.useTransition()

  function handleChange(next: boolean) {
    setChecked(next)
    startTransition(async () => {
      const result = await toggleDiscountActive(id, next)
      if (!result.ok) {
        setChecked(!next)
        toast.error(result.error)
      }
    })
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      disabled={pending}
      onClick={(e) => e.stopPropagation()}
      aria-label={checked ? 'Active' : 'Inactive'}
    />
  )
}

export function DiscountsTable({ discounts }: { discounts: Discount[] }) {
  const router = useRouter()

  const columns = React.useMemo<ColumnDef<Discount>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) =>
          row.original.code ? (
            <span className="font-mono text-xs">{row.original.code}</span>
          ) : (
            <Badge variant="outline">Auto</Badge>
          ),
      },
      { accessorKey: 'title', header: 'Title' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => TYPE_LABEL[row.original.type],
      },
      {
        id: 'value',
        header: 'Value',
        cell: ({ row }) => <span className="tabular-nums">{valueLabel(row.original)}</span>,
      },
      {
        accessorKey: 'scope',
        header: 'Scope',
        cell: ({ row }) => SCOPE_LABEL[row.original.scope],
      },
      {
        id: 'usage',
        header: 'Used / Max',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.used_count}
            {row.original.max_uses ? ` / ${row.original.max_uses}` : ''}
          </span>
        ),
      },
      {
        id: 'window',
        header: 'Active window',
        cell: ({ row }) => <span className="text-muted-foreground">{windowLabel(row.original)}</span>,
      },
      {
        id: 'is_active',
        header: 'Active',
        cell: ({ row }) => <DiscountActiveSwitch id={row.original.id} isActive={row.original.is_active} />,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={discounts}
      onRowClick={(row) => router.push(`/admin/discounts/${row.id}`)}
      emptyState={
        <EmptyState
          icon={BadgePercent}
          title="No discounts yet"
          description="Create a discount code or automatic promotion."
        />
      }
    />
  )
}
