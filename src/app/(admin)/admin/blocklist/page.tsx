import { ShieldAlert } from 'lucide-react'

import { requireOrg } from '@/lib/auth'
import { requireModule } from '@/lib/modules'
import { getServerClient } from '@/lib/supabase/server'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageHeader } from '@/components/ui/page-header'
import type { BlocklistEntry } from '@/types/db'

import { BlocklistTable, type BlocklistRow } from '@/modules/customers/components/blocklist-table'
import { NewBlocklistEntryDialog } from '@/modules/customers/components/new-blocklist-entry-dialog'

export const dynamic = 'force-dynamic'

export default async function BlocklistPage() {
  const ctx = await requireOrg()
  requireModule(ctx.org, 'customers')

  const supabase = await getServerClient()
  const { data } = await supabase
    .from('blocklist')
    .select('*')
    .eq('org_id', ctx.org.id)
    .order('created_at', { ascending: false })

  const entries = (data ?? []) as BlocklistEntry[]
  const creatorIds = Array.from(
    new Set(entries.map((e) => e.created_by).filter((id): id is string => Boolean(id))),
  )

  const creatorNames = new Map<string, string>()
  if (creatorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .in('user_id', creatorIds)
    for (const p of (profiles ?? []) as { user_id: string; full_name: string | null }[]) {
      creatorNames.set(p.user_id, p.full_name ?? 'Unknown')
    }
  }

  const rows: BlocklistRow[] = entries.map((entry) => ({
    ...entry,
    creatorName: entry.created_by ? (creatorNames.get(entry.created_by) ?? null) : null,
  }))

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Blocklist"
        description="Phone numbers, addresses, and IPs flagged for checkout risk."
        actions={<NewBlocklistEntryDialog />}
      />
      <div className="flex flex-col gap-4">
        <Alert>
          <ShieldAlert />
          <AlertTitle>Automatic checkout flagging</AlertTitle>
          <AlertDescription>
            When a checkout's phone or address matches a blocklist entry, the order is automatically flagged
            as high risk per the fraud settings.
          </AlertDescription>
        </Alert>
        <BlocklistTable entries={rows} />
      </div>
    </div>
  )
}
