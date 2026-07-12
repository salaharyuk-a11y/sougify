import { notFound } from 'next/navigation'
import { Building2, CheckCircle2 } from 'lucide-react'

import { requireUser } from '@/lib/auth'
import { getAdminClient } from '@/lib/supabase/admin'
import { getServerClient } from '@/lib/supabase/server'
import type { Org } from '@/types/db'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { OrgsTable, type PlatformOrgRow } from '@/modules/platform/components/orgs-table'

export const dynamic = 'force-dynamic'

export default async function PlatformPage() {
  await requireUser()

  const supabase = await getServerClient()
  const { data: isPlatformAdmin } = await supabase.rpc('is_platform_admin')
  if (!isPlatformAdmin) notFound()

  const admin = getAdminClient()
  const { data: orgsData } = await admin.from('orgs').select('*').order('created_at', { ascending: false })
  const orgs = (orgsData ?? []) as Org[]

  // Counted per-org via explicit head:true count queries (not a nested
  // org_members(count)/orders(count) embed) — keeps this correct without
  // depending on a PostgREST aggregate-embedding feature that can't be
  // verified against a live project in this environment.
  const counts = await Promise.all(
    orgs.map(async (org) => {
      const [membersResult, ordersResult] = await Promise.all([
        admin.from('org_members').select('user_id', { count: 'exact', head: true }).eq('org_id', org.id),
        admin.from('orders').select('id', { count: 'exact', head: true }).eq('org_id', org.id),
      ])
      return {
        orgId: org.id,
        membersCount: membersResult.count ?? 0,
        ordersCount: ordersResult.count ?? 0,
      }
    }),
  )
  const countsByOrgId = new Map(counts.map((c) => [c.orgId, c]))

  const orgRows: PlatformOrgRow[] = orgs.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    vertical: org.vertical,
    plan: org.plan,
    membersCount: countsByOrgId.get(org.id)?.membersCount ?? 0,
    ordersCount: countsByOrgId.get(org.id)?.ordersCount ?? 0,
    createdAt: org.created_at,
    isActive: org.is_active,
  }))

  const activeCount = orgs.filter((org) => org.is_active).length

  return (
    <div>
      <PageHeader title="Platform" description="Cross-organization view for platform operators." />

      <div className="flex flex-col gap-6">
        <Alert>
          <AlertTitle>Platform operators only</AlertTitle>
          <AlertDescription>Add user ids to the platform_admins table to grant access.</AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Organizations" value={orgs.length} icon={Building2} />
          <StatCard label="Active organizations" value={activeCount} icon={CheckCircle2} />
        </div>

        <OrgsTable orgs={orgRows} />
      </div>
    </div>
  )
}
