import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'discounts',
  name: 'Discounts',
  description: 'Discount codes and automatic promotions.',
  nav: [{ label: 'Discounts', href: '/admin/discounts', icon: 'BadgePercent' }],
}
