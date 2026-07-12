import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'orders',
  name: 'Orders',
  description: 'Order lifecycle from placement to delivery, plus returns.',
  nav: [
    { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
    { label: 'Returns', href: '/admin/returns', icon: 'ShoppingCart' },
  ],
  dashboardWidgets: ['sales-today', 'orders-recent'],
}
