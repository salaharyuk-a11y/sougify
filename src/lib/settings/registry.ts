// Sougify settings registry — Algeria-first defaults and labels.
import type { Role } from '@/types/db'

export type SettingType = 'boolean' | 'number' | 'text' | 'select' | 'json'
export type SettingGroup =
  | 'checkout' | 'payments' | 'delivery' | 'fraud' | 'inventory'
  | 'notifications' | 'tax' | 'localization' | 'printing' | 'storefront'

export interface SettingOption { value: string; label: string }
export interface SettingDef {
  key: string
  group: SettingGroup
  label: string
  help?: string
  type: SettingType
  options?: SettingOption[]
  default: unknown
  roles?: Role[]
}

export const SETTING_GROUPS: SettingGroup[] = [
  'checkout', 'payments', 'delivery', 'fraud', 'inventory',
  'notifications', 'tax', 'localization', 'printing', 'storefront',
]

export const SETTING_DEFS: SettingDef[] = [
  { key: 'checkout.guest_enabled', group: 'checkout', label: 'السماح بالشراء دون حساب', type: 'boolean', default: true },
  { key: 'checkout.min_order', group: 'checkout', label: 'الحد الأدنى للطلب (دج)', type: 'number', help: 'اترك القيمة 0 لتعطيل الحد الأدنى', default: 0 },

  { key: 'payments.cod_enabled', group: 'payments', label: 'تفعيل الدفع عند الاستلام', type: 'boolean', default: true },
  { key: 'payments.advance_required', group: 'payments', label: 'اشتراط دفع مسبق', type: 'boolean', default: false },
  { key: 'payments.advance_amount', group: 'payments', label: 'مبلغ التسبيق (دج)', type: 'number', help: 'يُستخدم عندما يكون نوع التسبيق مبلغاً ثابتاً', default: 0 },
  {
    key: 'payments.advance_type', group: 'payments', label: 'طريقة احتساب التسبيق', type: 'select',
    options: [{ value: 'fixed', label: 'مبلغ ثابت' }, { value: 'percent', label: 'نسبة من الإجمالي' }],
    default: 'fixed',
  },
  {
    key: 'payments.methods', group: 'payments', label: 'طرق الدفع المتاحة', type: 'json',
    help: 'في الوقت الحالي، الدفع عند الاستلام هو الخيار المفعّل افتراضياً. لا تضف مزود دفع قبل ربطه واختباره.',
    default: ['cod'],
  },

  { key: 'delivery.default_zone_fallback', group: 'delivery', label: 'سعر التوصيل الافتراضي (دج)', type: 'number', help: 'يُستخدم عندما لا توجد منطقة توصيل مطابقة', default: 0 },
  { key: 'delivery.free_above', group: 'delivery', label: 'توصيل مجاني ابتداءً من (دج)', type: 'number', help: 'القيمة 0 تعطل التوصيل المجاني', default: 0 },

  { key: 'fraud.enabled', group: 'fraud', label: 'تفعيل مؤشرات كشف الطلبات المشبوهة', type: 'boolean', default: false },
  {
    key: 'fraud.provider', group: 'fraud', label: 'مصدر فحص المخاطر', type: 'select',
    options: [{ value: 'disabled', label: 'غير مفعّل' }],
    default: 'disabled',
  },
  {
    key: 'fraud.high_risk_action', group: 'fraud', label: 'الإجراء عند ارتفاع مستوى المخاطر', type: 'select',
    options: [{ value: 'block', label: 'رفض الطلب' }, { value: 'require_full_advance', label: 'طلب دفع مسبق كامل' }, { value: 'flag', label: 'وضع علامة للمراجعة فقط' }],
    default: 'flag',
  },

  { key: 'inventory.track_stock', group: 'inventory', label: 'متابعة كميات المخزون', type: 'boolean', default: true },
  { key: 'inventory.allow_backorder', group: 'inventory', label: 'السماح ببيع المنتجات غير المتوفرة', type: 'boolean', default: false },
  { key: 'inventory.low_stock_threshold', group: 'inventory', label: 'حد التنبيه عند انخفاض المخزون', type: 'number', default: 5 },

  { key: 'notifications.events', group: 'notifications', label: 'قنوات الإشعارات حسب الحدث', help: 'إعداد متقدم بصيغة JSON. الأحداث غير المحددة تستخدم إشعارات داخل المنصة.', type: 'json', default: {} },

  {
    key: 'tax.mode', group: 'tax', label: 'طريقة احتساب الضريبة', type: 'select',
    options: [{ value: 'none', label: 'غير مفعّلة' }, { value: 'inclusive', label: 'السعر شامل الضريبة' }, { value: 'exclusive', label: 'إضافة الضريبة إلى السعر' }],
    default: 'none',
  },
  { key: 'tax.vat_rate', group: 'tax', label: 'نسبة الرسم على القيمة المضافة (%)', help: 'النسبة المرجعية العامة 19%، وقد تختلف المعاملة حسب طبيعة النشاط والإعفاءات. راجع محاسبك قبل تفعيلها.', type: 'number', default: 19 },

  {
    key: 'localization.language', group: 'localization', label: 'لغة المتجر الافتراضية', type: 'select',
    options: [{ value: 'ar', label: 'العربية' }, { value: 'fr', label: 'Français' }],
    default: 'ar',
  },

  {
    key: 'printing.invoice_template', group: 'printing', label: 'قالب الفاتورة', type: 'select',
    options: [{ value: 'a4_default', label: 'A4 قياسي' }],
    default: 'a4_default',
  },
  { key: 'printing.footer_text', group: 'printing', label: 'النص أسفل الفاتورة', type: 'text', default: '' },

  { key: 'storefront.announcement', group: 'storefront', label: 'نص شريط الإعلان', help: 'اتركه فارغاً لإخفاء الشريط', type: 'text', default: '' },
  { key: 'storefront.whatsapp_number', group: 'storefront', label: 'رقم واتساب للزر العائم', type: 'text', default: '' },
  { key: 'storefront.primary_color', group: 'storefront', label: 'اللون الرئيسي للمتجر', type: 'text', default: '#059669' },
]

export const DEFAULT_SETTINGS: Record<string, unknown> = Object.fromEntries(
  SETTING_DEFS.map((def) => [def.key, def.default]),
)
