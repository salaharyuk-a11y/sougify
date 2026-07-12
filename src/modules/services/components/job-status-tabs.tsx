'use client'

import { useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ServiceJobStatus } from '@/types/db'

const STATUSES: { label: string; value: ServiceJobStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
  { label: 'Invoiced', value: 'invoiced' },
  { label: 'Cancelled', value: 'cancelled' },
]

interface JobStatusTabsProps {
  current: string
}

function JobStatusTabs({ current }: JobStatusTabsProps) {
  const router = useRouter()

  return (
    <Tabs
      value={current}
      onValueChange={(value) => {
        router.push(value === 'all' ? '/admin/services' : `/admin/services?status=${value}`)
      }}
    >
      <TabsList>
        {STATUSES.map((status) => (
          <TabsTrigger key={status.value} value={status.value}>
            {status.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { JobStatusTabs }
