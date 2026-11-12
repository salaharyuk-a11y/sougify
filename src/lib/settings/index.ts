import { cache } from 'react'
import { getAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_SETTINGS } from '@/lib/settings/registry'

/**
 * Legacy Bangladesh settings are deliberately normalized at read time.
 * This keeps old rows intact for audit/history while preventing retired
 * payment providers and language values from leaking into the Algeria UI.
 */
export const getOrgSettings = cache(async (orgId: string): Promise<Record<string, unknown>> => {
  const supabase = getAdminClient()
  const { data, error } = await supabase.from('org_settings').select('key, value').eq('org_id', orgId)
  const overrides: Record<string, unknown> = {}

  if (!error && data) {
    for (const row of data as { key: string; value: unknown }[]) overrides[row.key] = row.value
  }

  const settings = { ...DEFAULT_SETTINGS, ...overrides }
  const methods = settings['payments.methods']
  if (Array.isArray(methods)) {
    settings['payments.methods'] = methods.filter((method) => method === 'cod')
    if ((settings['payments.methods'] as unknown[]).length === 0) settings['payments.methods'] = ['cod']
  }

  // Retired Bangladesh payment integrations remain in historical rows, but are never
  // exposed or used by the Algeria-first checkout. COD is the only enabled v1 method.
  settings['payments.cod_enabled'] = true
  settings['payments.methods'] = ['cod']
  settings['payments.manual_mfs.enabled'] = false
  settings['payments.uddoktapay.enabled'] = false
  settings['payments.advance_required'] = false
  settings['fraud.provider'] = 'disabled'

  // Map legacy language values to the supported Algeria storefront languages.
  if (settings['localization.language'] !== 'fr') settings['localization.language'] = 'ar'
  return settings
})

export function getSetting<T>(settings: Record<string, unknown>, key: string): T {
  return settings[key] as T
}

export function settingBool(settings: Record<string, unknown>, key: string): boolean {
  return Boolean(getSetting(settings, key))
}

export function settingNum(settings: Record<string, unknown>, key: string): number {
  const value = getSetting<unknown>(settings, key)
  return typeof value === 'number' ? value : Number(value ?? 0)
}

export function settingStr(settings: Record<string, unknown>, key: string): string {
  const value = getSetting<unknown>(settings, key)
  return typeof value === 'string' ? value : String(value ?? '')
}
