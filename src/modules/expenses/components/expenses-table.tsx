'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table'
import { mediaUrl } from '@/lib/media-url'
import { formatMoney } from '@/lib/money'
import { deleteExpenseAction } from '@/modules/expenses/actions'

import { ExpenseFormDialog, type ExpenseWithReceipt } from './expense-form-dialog'

interface ExpensesTableProps {
  expenses: ExpenseWithReceipt[]
}

function ExpensesTable({ expenses }: ExpensesTableProps) {
  const router = useRouter()

  async function handleDelete(id: string) {
    const result = await deleteExpenseAction({ id })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success('Expense deleted')
    router.refresh()
  }

  const columns: ColumnDef<ExpenseWithReceipt, unknown>[] = [
    {
      accessorKey: 'spent_at',
      header: 'Date',
      cell: ({ row }) => format(parseISO(row.original.spent_at), 'd MMM yyyy'),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => <div className="text-right tabular-nums">{formatMoney(row.original.amount)}</div>,
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.note || '—'}</span>,
    },
    {
      id: 'receipt',
      header: 'Receipt',
      cell: ({ row }) => {
        const path = row.original.receiptPath
        if (!path) return <span className="text-muted-foreground">—</span>
        const src = mediaUrl(path)
        return (
          <a href={src} target="_blank" rel="noreferrer" className="block w-fit">
            {/* Plain img: receipt host isn't guaranteed to match next/image's remotePatterns. */}
            <img src={src} alt="Receipt" className="size-8 rounded-md border object-cover" />
          </a>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <ExpenseFormDialog
            expense={row.original}
            trigger={
              <Button type="button" variant="ghost" size="icon" className="size-7">
                <Pencil className="size-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          />
          <ConfirmDialog
            trigger={
              <Button type="button" variant="ghost" size="icon" className="size-7">
                <Trash2 className="size-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            }
            title="Delete this expense?"
            description="This can't be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable columns={columns} data={expenses} emptyState={<span className="text-muted-foreground">No expenses yet.</span>} />
  )
}

export { ExpensesTable }
