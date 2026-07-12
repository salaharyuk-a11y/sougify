// Module system core types. See docs/architecture.md §2 (binding contract).

export type ModuleKey =
  | 'catalog'
  | 'orders'
  | 'pos'
  | 'customers'
  | 'discounts'
  | 'delivery'
  | 'receipts'
  | 'cms'
  | 'storefront'
  | 'reports'
  | 'expenses'
  | 'reviews'
  | 'courses'
  | 'services'
  | 'listings'

// Widget ids rendered by the admin dashboard (src/app/(admin)/admin/page.tsx).
export type DashboardWidgetId =
  | 'sales-today'
  | 'orders-recent'
  | 'low-stock'
  | 'deliveries-pending'
  | 'cod-outstanding'
  | 'top-products'
  | 'enrollments-recent'
  | 'jobs-today'
  | 'listings-active'
  | 'inquiries-new'
  | 'expenses-month'
  | 'reviews-pending'

export interface ModuleDef {
  key: ModuleKey
  name: string
  description: string
  /** icon = lucide icon name (see src/lib/icon-map.tsx) */
  nav: { label: string; href: string; icon: string }[]
  /** widget ids rendered by dashboard */
  dashboardWidgets?: DashboardWidgetId[]
}
