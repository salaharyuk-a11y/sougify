'use client'

import * as React from 'react'
import { toast } from 'sonner'

import type { Role } from '@/types/db'
import type { SettingDef, SettingGroup } from '@/lib/settings/registry'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSettingsAction } from '@/modules/settings/actions'
import { SettingField } from './setting-field'

export const GROUP_LABELS: Record<SettingGroup, string> = {
  checkout: 'إتمام الطلب',
  payments: 'الدفع',
  delivery: 'التوصيل',
  fraud: 'مكافحة الطلبات الوهمية',
  inventory: 'المخزون',
  notifications: 'الإشعارات',
  tax: 'الضرائب',
  localization: 'اللغة والمنطقة',
  printing: 'الطباعة والفواتير',
  storefront: 'واجهة المتجر',
}

interface SettingsGroupSectionProps {
  group: SettingGroup
  defs: SettingDef[]
  initialValues: Record<string, unknown>
  role: Role
}

function SettingsGroupSection({ group, defs, initialValues, role }: SettingsGroupSectionProps) {
  const visibleDefs = defs.filter((def) => !def.roles || def.roles.includes(role))
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues)
  const [invalidKeys, setInvalidKeys] = React.useState<Set<string>>(new Set())
  const [saving, setSaving] = React.useState(false)

  const dirtyKeys = visibleDefs
    .map((def) => def.key)
    .filter((key) => JSON.stringify(values[key]) !== JSON.stringify(initialValues[key]))
  const isDirty = dirtyKeys.length > 0
  const hasErrors = invalidKeys.size > 0

  if (visibleDefs.length === 0) return null

  async function handleSave() {
    if (!dirtyKeys.length) return
    setSaving(true)
    try {
      const result = await updateSettingsAction({
        entries: dirtyKeys.map((key) => ({ key, value: values[key] })),
      })
      if (result.ok) toast.success('تم حفظ الإعدادات')
      else toast.error(result.error)
    } catch {
      toast.error('تعذر حفظ الإعدادات. حاول مرة أخرى.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card id={`section-${group}`} className="scroll-mt-6">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle className="text-base">{GROUP_LABELS[group]}</CardTitle>
        <Button size="sm" disabled={!isDirty || hasErrors || saving} onClick={handleSave}>
          {saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {visibleDefs.map((def) => (
            <SettingField
              key={def.key}
              def={def}
              value={values[def.key]}
              disabled={saving}
              onChange={(key, next) => setValues((prev) => ({ ...prev, [key]: next }))}
              onValidityChange={(key, valid) =>
                setInvalidKeys((prev) => {
                  const next = new Set(prev)
                  if (valid) next.delete(key)
                  else next.add(key)
                  return next
                })
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { SettingsGroupSection }
