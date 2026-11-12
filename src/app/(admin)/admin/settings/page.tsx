import { requireOrg, requireRole } from '@/lib/auth'
import { SETTING_DEFS, SETTING_GROUPS } from '@/lib/settings/registry'
import { PageHeader } from '@/components/ui/page-header'
import { OrgProfileSection } from '@/modules/settings/components/org-profile-section'
import { SettingsGroupSection, GROUP_LABELS } from '@/modules/settings/components/settings-group-section'
import { SettingsNav } from '@/modules/settings/components/settings-nav'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const ctx = await requireOrg()
  requireRole(ctx, 'admin')

  const sections = [
    { id: 'section-organization', label: 'المؤسسة' },
    ...SETTING_GROUPS.map((group) => ({ id: `section-${group}`, label: GROUP_LABELS[group] })),
  ]

  return (
    <main dir="rtl" className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="الإعدادات"
        description="إدارة بيانات المؤسسة، وحدات العمل، وإعدادات تشغيل متجرك."
      />

      <div className="flex items-start gap-8 max-md:flex-col max-md:gap-4">
        <SettingsNav sections={sections} />
        <div className="flex min-w-0 flex-1 flex-col gap-5 pb-16">
          <OrgProfileSection org={ctx.org} />
          {SETTING_GROUPS.map((group) => (
            <SettingsGroupSection
              key={group}
              group={group}
              defs={SETTING_DEFS.filter((def) => def.group === group)}
              initialValues={ctx.settings}
              role={ctx.role}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
