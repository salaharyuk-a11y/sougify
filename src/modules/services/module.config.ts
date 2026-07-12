import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'services',
  name: 'Services',
  description: 'Service jobs, quotes, and appointment scheduling.',
  nav: [{ label: 'Services', href: '/admin/services', icon: 'Wrench' }],
  dashboardWidgets: ['jobs-today'],
}
