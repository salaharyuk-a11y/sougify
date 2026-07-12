import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'reviews',
  name: 'Reviews',
  description: 'Customer product reviews and moderation.',
  nav: [{ label: 'Reviews', href: '/admin/reviews', icon: 'Star' }],
  dashboardWidgets: ['reviews-pending'],
}
