import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'receipts',
  name: 'Receipts',
  description: 'Invoice, thermal, and label printing with numbering.',
  nav: [{ label: 'Receipts', href: '/admin/receipts', icon: 'Receipt' }],
}
