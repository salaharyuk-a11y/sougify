import type { Metadata } from 'next'
import { ArrowUpLeft, Building2, ShieldCheck, Store } from 'lucide-react'

import { requireUser } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import type { Org, Role } from '@/types/db'

import { CreateOrgStepper } from './_components/create-org-stepper'
import { OrgPicker } from './_components/org-picker'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'إعداد مساحة العمل',
  description: 'اختر مؤسستك أو أنشئ مساحة عمل جديدة على Sougify.',
}

interface Membership {
  org: Org
  role: Role
}

/**
 * Load only organizations the signed-in user belongs to.
 * The membership check remains server-side; the UI never trusts client IDs.
 */
async function loadMemberships(userId: string): Promise<Membership[]> {
  const supabase = await getServerClient()

  const { data: memberRows } = await supabase
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', userId)

  const rows = (memberRows ?? []) as { org_id: string; role: Role }[]
  if (rows.length === 0) return []

  const { data: orgRows } = await supabase
    .from('orgs')
    .select('*')
    .in('id', rows.map((row) => row.org_id))
    .eq('is_active', true)

  const orgs = (orgRows ?? []) as Org[]
  const roleByOrgId = new Map(rows.map((row) => [row.org_id, row.role]))

  return orgs
    .map((org) => ({ org, role: roleByOrgId.get(org.id) }))
    .filter((membership): membership is Membership => Boolean(membership.role))
}

export default async function OnboardingPage() {
  const user = await requireUser()
  const memberships = await loadMemberships(user.id)

  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 border-t-2 border-primary/15" />

      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <a href="/onboarding" className="inline-flex items-center gap-2.5 rounded-md" aria-label="Sougify">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Store className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">Sougify</span>
          </a>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            مساحة عملك، وبياناتك في مكان واحد
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-4xl gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)] lg:gap-14">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Building2 className="size-3.5" aria-hidden="true" />
                مساحة العمل الخاصة بك
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                مرحباً بك في <span className="text-primary">Sougify</span>
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                اختر المؤسسة التي تريد العمل عليها، أو أنشئ مساحة جديدة لتنظيم منتجاتك وطلباتك وعملياتك التجارية.
              </p>
            </div>

            {memberships.length > 0 ? (
              <OrgPicker memberships={memberships} />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-5">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">لا توجد مؤسسة مرتبطة بحسابك بعد</h2>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  أنشئ مؤسستك الأولى للبدء في إعداد مساحة عملك على Sougify.
                </p>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4 lg:pt-1">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <ArrowUpLeft className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {memberships.length > 0 ? 'أضف مساحة عمل جديدة' : 'أنشئ مساحة عملك'}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">خطوات بسيطة للبدء</p>
              </div>
            </div>
            <CreateOrgStepper heading={memberships.length > 0 ? 'إنشاء مؤسسة جديدة' : 'إعداد مؤسستك'} />
            <p className="text-center text-[11px] leading-5 text-muted-foreground">
              بإنشاء مؤسسة، ستتمكن من إدارة بياناتها وأعضاء فريقها بشكل مستقل.
            </p>
          </aside>
        </section>

        <footer className="mt-auto flex flex-col items-center justify-between gap-2 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Sougify</span>
          <span>منصة لإدارة وتنمية أعمالك</span>
        </footer>
      </div>
    </main>
  )
}
