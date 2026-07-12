import type { Vertical } from '@/types/db'

import type { ModuleKey } from './types'

export const VERTICAL_PRESETS: Record<
  Vertical,
  { name: string; description: string; modules: ModuleKey[]; icon: string }
> = {
  ecommerce: {
    name: 'E-commerce',
    description: 'Sell physical products online and in-store.',
    modules: [
      'catalog',
      'orders',
      'pos',
      'customers',
      'discounts',
      'delivery',
      'receipts',
      'cms',
      'storefront',
      'reports',
      'expenses',
      'reviews',
    ],
    icon: 'Store',
  },
  courses: {
    name: 'Courses',
    description: 'Sell and deliver online courses with enrollments.',
    modules: [
      'courses',
      'orders',
      'customers',
      'discounts',
      'cms',
      'storefront',
      'receipts',
      'reports',
      'expenses',
    ],
    icon: 'GraduationCap',
  },
  services: {
    name: 'Services',
    description: 'Manage service jobs, quotes, and appointments.',
    modules: ['services', 'orders', 'customers', 'receipts', 'reports', 'expenses', 'cms'],
    icon: 'Wrench',
  },
  realestate: {
    name: 'Real Estate',
    description: 'List properties for sale or rent and manage buyer inquiries.',
    modules: ['listings', 'customers', 'cms', 'storefront', 'reports', 'expenses'],
    icon: 'Building2',
  },
}

export const DEFAULT_VERTICAL: Vertical = 'ecommerce'
