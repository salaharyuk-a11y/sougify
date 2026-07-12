import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'expenses',
  name: 'Expenses',
  description: 'Track business expenses by category.',
  nav: [{ label: 'Expenses', href: '/admin/expenses', icon: 'Wallet' }],
  dashboardWidgets: ['expenses-month'],
}
