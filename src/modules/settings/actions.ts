'use server'

import { revalidatePath } from 'next/cache'
import { requireOrg, requireRole } from '@/lib/auth'
import { audit } from '@/lib/audit'
import { getServerClient } from '@/lib/supabase/server'
import { SETTING_DEFS, type SettingDef } from '@/lib/settings/registry'
import type { ActionResult } from '@/lib/types'
import { orgProfileSchema, updateSettingsSchema, type OrgProfileInput } from './schemas'

const SETTING_DEFS_BY_KEY = new Map<string, SettingDef>(SETTING_DEFS.map((def) => [def.key, def]))

function validateSettingValue(def: SettingDef, value: unknown): string | null {
  switch (def.type) {
    case 'boolean': return typeof value === 'boolean' ? null : `${def.label}: قيمة غير صالحة`
    case 'number': return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? null : `${def.label}: أدخل رقماً صالحاً`
    case 'text': return typeof value === 'string' ? null : `${def.label}: نص غير صالح`
    case 'select': return typeof value === 'string' && def.options?.some((opt) => opt.value === value) ? null : `${def.label}: خيار غير صالح`
    case 'json': return value === undefined ? `${def.label}: بيانات غير صالحة` : null
    default: return null
  }
}

export async function updateSettingsAction(input: {
  entries: { key: string; value: unknown }[]
}): Promise<ActionResult> {
  const ctx = await requireOrg()
  requireRole(ctx, 'admin')
  const parsed = updateSettingsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' }

  const before: Record<string, unknown> = {}
  const after: Record<string, unknown> = {}
  const rows: { org_id: string; key: string; value: unknown; updated_by: string; updated_at: string }[] = []
  const now = new Date().toISOString()

  for (const entry of parsed.data.entries) {
    const def = SETTING_DEFS_BY_KEY.get(entry.key)
    if (!def) return { ok: false, error: `إعداد غير معروف: ${entry.key}` }
    if (def.roles && !def.roles.includes(ctx.role)) return { ok: false, error: `ليست لديك صلاحية تعديل: ${def.label}` }
    const validationError = validateSettingValue(def, entry.value)
    if (validationError) return { ok: false, error: validationError }
    before[entry.key] = ctx.settings[entry.key]
    after[entry.key] = entry.value
    rows.push({ org_id: ctx.org.id, key: entry.key, value: entry.value, updated_by: ctx.user.id, updated_at: now })
  }

  try {
    const supabase = await getServerClient()
    const { error } = await supabase.from('org_settings').upsert(rows, { onConflict: 'org_id,key' })
    if (error) return { ok: false, error: error.message }
    audit(ctx, 'settings.updated', 'org_settings', ctx.org.id, before, after)
    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'تعذر حفظ الإعدادات' }
  }
}

export async function updateOrgProfileAction(input: OrgProfileInput): Promise<ActionResult> {
  const ctx = await requireOrg()
  requireRole(ctx, 'admin')
  const parsed = orgProfileSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'بيانات المؤسسة غير صالحة' }
  const data = parsed.data

  const before = {
    name: ctx.org.name,
    phone: ctx.org.phone,
    email: ctx.org.email,
    address: ctx.org.address,
    currency: ctx.org.currency,
    timezone: ctx.org.timezone,
    enabled_modules: ctx.org.enabled_modules,
  }
  const after = {
    name: data.name,
    phone: data.phone || null,
    email: data.email || null,
    address: data.address || null,
    currency: 'DZD',
    timezone: 'Africa/Algiers',
    enabled_modules: data.enabled_modules,
  }

  try {
    const supabase = await getServerClient()
    const { error } = await supabase.from('orgs')
      .update({ ...after, updated_at: new Date().toISOString() })
      .eq('id', ctx.org.id)
    if (error) return { ok: false, error: error.message }
    audit(ctx, 'org.updated', 'orgs', ctx.org.id, before, after)
    revalidatePath('/admin/settings')
    revalidatePath('/admin', 'layout')
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'تعذر حفظ بيانات المؤسسة' }
  }
}
