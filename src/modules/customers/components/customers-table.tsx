'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/ui/copy-button'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchInput } from '@/components/ui/search-input'
import { formatMoney } from '@/lib/money'
import type { Customer } from '@/types/db'

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
  }, [customers, search])

  const columns = React.useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'الاسم',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.name}</span>
            {row.original.is_blocked ? <Badge variant="destructive">محظور</Badge> : null}
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="tabular-nums">{row.original.phone}</span>
            <span onClick={(e) => e.stopPropagation()}>
              <CopyButton text={row.original.phone} />
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'orders_count',
        header: 'الطلبات',
        cell: ({ row }) => <span className="tabular-nums">{row.original.orders_count}</span>,
      },
      {
        accessorKey: 'total_spent',
        header: 'إجمالي المشتريات',
        cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.total_spent)}</span>,
      },
      {
        accessorKey: 'last_order_at',
        header: 'آخر طلب',
        cell: ({ row }) =>
          row.original.last_order_at ? new Intl.DateTimeFormat('ar-DZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(row.original.last_order_at)) : '—',
      },
      {
        id: 'tags',
        header: 'التصنيفات',
        cell: ({ row }) => {
          const tags = row.original.tags ?? []
          if (tags.length === 0) return null
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 ? (
                <span className="text-muted-foreground text-xs">+{tags.length - 3}</span>
              ) : null}
            </div>
          )
        },
      },
    ],
    [],
  )

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="ابحث بالاسم أو رقم الهاتف..."
        className="max-w-sm"
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => router.push(`/admin/customers/${row.id}`)}
        emptyState={
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء بعد"
            description="سيظهر العملاء هنا عند إضافتهم أو تسجيل أول طلباتهم."
          />
        }
      />
    </div>
  )
}
