'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { CopyButton } from '@/components/ui/copy-button'
import { DataTable } from '@/components/ui/data-table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { InquiryStatus } from '@/types/db'

import { updateInquiryStatus } from '../actions'
import type { InquiryRow } from '../schemas'

interface InquiriesTableProps {
  inquiries: InquiryRow[]
}

function InquiriesTable({ inquiries }: InquiriesTableProps) {
  async function handleStatusChange(inquiryId: string, status: InquiryStatus) {
    const result = await updateInquiryStatus(inquiryId, status)
    if (result.ok) toast.success('Inquiry updated')
    else toast.error(result.error)
  }

  const columns = useMemo<ColumnDef<InquiryRow>[]>(
    () => [
      {
        id: 'listing',
        header: 'Listing',
        cell: ({ row }) => (
          <span className="text-foreground font-medium">{row.original.listing?.title ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        id: 'phone',
        header: 'Phone',
        cell: ({ row }) =>
          row.original.phone ? (
            <div className="flex items-center gap-1">
              <span>{row.original.phone}</span>
              <CopyButton text={row.original.phone} />
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: 'message',
        header: 'Message',
        cell: ({ row }) => {
          const message = row.original.message
          if (!message) return <span className="text-muted-foreground">—</span>
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="block max-w-[240px] truncate text-left hover:underline">
                  {message}
                </button>
              </PopoverTrigger>
              <PopoverContent className="text-[13px] whitespace-pre-wrap">{message}</PopoverContent>
            </Popover>
          )
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(value) => handleStatusChange(row.original.id, value as InquiryStatus)}
          >
            <SelectTrigger size="sm" className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        id: 'created_at',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.created_at), 'd MMM yyyy'),
      },
    ],
    [],
  )

  return <DataTable columns={columns} data={inquiries} searchKey="name" searchPlaceholder="Search inquiries..." />
}

export { InquiriesTable }
