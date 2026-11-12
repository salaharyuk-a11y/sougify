import { ArrowLeft, Building2, GraduationCap, Store, Wrench, Crown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { setActiveOrg } from '@/lib/actions/set-org'
import type { Org, Role } from '@/types/db'

interface OrgPickerProps {
  memberships: { org: Org; role: Role }[]
}

const VERTICAL_LABELS: Record<Org['vertical'], { label: string; Icon: typeof Store }> = {
  ecommerce: { label: 'تجارة إلكترونية', Icon: Store },
  courses: { label: 'دورات وتدريب', Icon: GraduationCap },
  services: { label: 'خدمات', Icon: Wrench },
  realestate: { label: 'عقارات', Icon: Building2 },
}

const ROLE_LABELS: Record<Role, string> = {
  owner: 'المالك',
  admin: 'مدير',
  manager: 'مشرف',
  staff: 'موظف',
  rider: 'مندوب توصيل',
  viewer: 'مشاهد',
}

/** Server-rendered organization choices; the server action revalidates membership. */
export function OrgPicker({ memberships }: OrgPickerProps) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="organization-list-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="organization-list-heading" className="text-sm font-semibold text-foreground">
          مؤسساتك
        </h2>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] tabular-nums text-muted-foreground">
          {memberships.length} {memberships.length === 1 ? 'مؤسسة' : 'مؤسسات'}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {memberships.map(({ org, role }) => {
          const { label, Icon } = VERTICAL_LABELS[org.vertical] ?? VERTICAL_LABELS.ecommerce

          return (
            <article
              key={org.id}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-primary/40 hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">{org.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{label}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ROLE_LABELS[role] ?? role}</span>
                    {role === 'owner' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Crown className="size-3" aria-hidden="true" />
                        المالك
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <form action={setActiveOrg.bind(null, org.id)} className="sm:shrink-0">
                <Button type="submit" size="sm" className="w-full gap-2 sm:w-auto">
                  فتح لوحة التحكم
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </article>
          )
        })}
      </div>
    </section>
  )
}
