import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'reports',
  name: 'Reports',
  description: 'Sales, delivery, and financial reporting.',
  nav: [{ label: 'Reports', href: '/admin/reports', icon: 'BarChart3' }],
}
