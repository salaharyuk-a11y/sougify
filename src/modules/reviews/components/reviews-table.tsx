'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Check, Star, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table'
import { EmptyState } from '@/components/ui/empty-state'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Review, ReviewStatus } from '@/types/db'

import { bulkPublishReviews, deleteReview, publishReview, rejectReview } from '../actions'
import { RatingStars } from './rating-stars'

export interface ReviewRow extends Review {
  product: { name: string } | null
}

const TABS: { value: ReviewStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter()
  const [tab, setTab] = React.useState<ReviewStatus>('pending')

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as ReviewStatus)}>
      <TabsList>
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
            <Badge variant="secondary" className="ml-1">
              {reviews.filter((r) => r.status === t.value).length}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((t) => (
        <TabsContent key={t.value} value={t.value} className="pt-4">
          <ReviewsPanel
            status={t.value}
            reviews={reviews.filter((r) => r.status === t.value)}
            onChanged={() => router.refresh()}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function ReviewsPanel({
  status,
  reviews,
  onChanged,
}: {
  status: ReviewStatus
  reviews: ReviewRow[]
  onChanged: () => void
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [pending, startTransition] = React.useTransition()

  React.useEffect(() => {
    setSelected(new Set())
  }, [reviews])

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === reviews.length ? new Set() : new Set(reviews.map((r) => r.id))))
  }

  async function handlePublish(id: string) {
    const result = await publishReview(id)
    if (!result.ok) toast.error(result.error)
    else {
      toast.success('Review published')
      onChanged()
    }
  }

  async function handleReject(id: string) {
    const result = await rejectReview(id)
    if (!result.ok) toast.error(result.error)
    else {
      toast.success('Review rejected')
      onChanged()
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteReview(id)
    if (!result.ok) toast.error(result.error)
    else {
      toast.success('Review deleted')
      onChanged()
    }
  }

  function handleBulkPublish() {
    const ids = Array.from(selected)
    startTransition(async () => {
      const result = await bulkPublishReviews(ids)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(`Published ${result.data?.count ?? ids.length} review(s)`)
      setSelected(new Set())
      onChanged()
    })
  }

  const columns = React.useMemo<ColumnDef<ReviewRow>[]>(() => {
    const cols: ColumnDef<ReviewRow>[] = []

    if (status === 'pending') {
      cols.push({
        id: 'select',
        header: () => (
          <Checkbox
            checked={reviews.length > 0 && selected.size === reviews.length}
            onCheckedChange={toggleAll}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.has(row.original.id)}
            onCheckedChange={() => toggleOne(row.original.id)}
            aria-label="Select row"
          />
        ),
      })
    }

    cols.push(
      {
        id: 'product',
        accessorFn: (row) => row.product?.name ?? '',
        header: 'Product',
        cell: ({ row }) => row.original.product?.name ?? '—',
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer',
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => <RatingStars rating={row.original.rating} />,
      },
      {
        id: 'content',
        header: 'Review',
        cell: ({ row }) => {
          const { title, body } = row.original
          const text = [title, body].filter(Boolean).join(' — ')
          if (!text) return <span className="text-muted-foreground">—</span>
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="max-w-64 truncate text-left hover:underline">
                  {text}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {title ? <p className="mb-1 text-sm font-medium">{title}</p> : null}
                {body ? <p className="text-muted-foreground text-sm whitespace-pre-wrap">{body}</p> : null}
              </PopoverContent>
            </Popover>
          )
        },
      },
      {
        accessorKey: 'is_verified',
        header: 'Verified',
        cell: ({ row }) => (row.original.is_verified ? <Badge variant="secondary">Verified</Badge> : null),
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.created_at), 'd MMM yyyy'),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const review = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              {review.status !== 'published' ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => handlePublish(review.id)}>
                      <Check className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Publish</TooltipContent>
                </Tooltip>
              ) : null}
              {review.status !== 'rejected' ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => handleReject(review.id)}>
                      <X className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reject</TooltipContent>
                </Tooltip>
              ) : null}
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-7">
                    <Trash2 className="size-3.5" />
                  </Button>
                }
                title="Delete this review?"
                description="This permanently removes the review. This can't be undone."
                confirmLabel="Delete"
                destructive
                onConfirm={() => handleDelete(review.id)}
              />
            </div>
          )
        },
      },
    )

    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selected, reviews])

  return (
    <DataTable
      columns={columns}
      data={reviews}
      toolbar={
        status === 'pending' && selected.size > 0 ? (
          <Button size="sm" onClick={handleBulkPublish} disabled={pending}>
            Publish {selected.size} selected
          </Button>
        ) : undefined
      }
      emptyState={<EmptyState icon={Star} title={`No ${status} reviews`} description="Reviews will show up here." />}
    />
  )
}
