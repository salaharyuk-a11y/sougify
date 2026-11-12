import { z } from 'zod'

export const MODULE_KEY_VALUES = [
  'catalog', 'orders', 'pos', 'customers', 'discounts', 'delivery',
  'receipts', 'cms', 'storefront', 'reports', 'expenses', 'reviews',
  'courses', 'services', 'listings',
] as const

export const orgProfileSchema = z.object({
  name: z.string().trim().min(1, 'اسم المؤسسة مطلوب').max(200, 'الاسم طويل جداً'),
  phone: z.string().trim().max(32, 'رقم الهاتف طويل جداً').optional().nullable(),
  email: z.union([z.string().trim().email('البريد الإلكتروني غير صالح'), z.literal('')]).optional().nullable(),
  address: z.string().trim().max(500, 'العنوان طويل جداً').optional().nullable(),
  enabled_modules: z.array(z.enum(MODULE_KEY_VALUES)),
})

export type OrgProfileInput = z.infer<typeof orgProfileSchema>

export const settingEntrySchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
})

export const updateSettingsSchema = z.object({
  entries: z.array(settingEntrySchema).min(1, 'لا توجد تغييرات للحفظ'),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
