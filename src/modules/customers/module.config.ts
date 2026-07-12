import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'customers',
  name: 'Customers',
  description: 'Customer profiles, order history, and blocklist.',
  nav: [{ label: 'Customers', href: '/admin/customers', icon: 'Users' }],
}
