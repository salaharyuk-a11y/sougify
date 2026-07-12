import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'listings',
  name: 'Listings',
  description: 'Real estate listings and buyer inquiries.',
  nav: [{ label: 'Listings', href: '/admin/listings', icon: 'Building2' }],
  dashboardWidgets: ['listings-active', 'inquiries-new'],
}
