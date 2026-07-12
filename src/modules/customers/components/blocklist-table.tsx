'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { ShieldBan, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import type { BlocklistEntry } from '@/types/db'

import { removeBlocklistEntry } from '../actions'

export interface BlocklistRow extends BlocklistEntry {
  creatorName: string | null
}

const KIND_LABEL: Record<BlocklistEntry['kind'], string> = {
  phone: 'Phone',
  address: 'Address',
  ip: 'IP',
}

export function BlocklistTable({ entries }: { entries: BlocklistRow[] }) {
  const router = useRouter()

  async function handleRemove(id: string) {
    const result = await removeBlocklistEntry(id)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success('Removed from blocklist')
    router.refresh()
  }

  const columns = React.useMemo<ColumnDef<BlocklistRow>[]>(
    () => [
      {
        accessorKey: 'kind',
        header: 'Kind',
        cell: ({ row }) => <Badge variant="outline">{KIND_LABEL[row.original.kind]}</Badge>,
      },
      { accessorKey: 'value', header: 'Value' },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => row.original.reason ?? <span className="text-muted-foreground">—</span>,
      },
      {
        accessorKey: 'creatorName',
        header: 'Added by',
        cell: ({ row }) => row.original.creatorName ?? <span className="text-muted-foreground">System</span>,
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.created_at), 'd MMM yyyy'),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-7">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Remove this entry?"
              description="Checkout will no longer auto-flag this value as high risk."
              confirmLabel="Remove"
              destructive
              onConfirm={() => handleRemove(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={entries}
      emptyState={
        <EmptyState
          icon={ShieldBan}
          title="Blocklist is empty"
          description="Blocked phone numbers, addresses, and IPs will appear here."
        />
      }
    />
  )
}
