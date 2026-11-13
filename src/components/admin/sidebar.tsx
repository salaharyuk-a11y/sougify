'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getIcon } from '@/lib/icon-map'
import { MODULES } from '@/modules/registry'
import type { NavItem } from '@/lib/modules'
import { OrgSwitcher } from '@/components/admin/org-switcher'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarOrg { id: string; name: string }
interface SidebarProps {
  org: SidebarOrg
  orgs: SidebarOrg[]
  nav: { main: NavItem[]; core: NavItem[] }
  collapsed?: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

const NAV_AR: Record<string, string> = {
  Dashboard: 'لوحة التحكم', Catalog: 'الكتالوج', Products: 'المنتجات', Categories: 'التصنيفات',
  Inventory: 'المخزون', Orders: 'الطلبات', Returns: 'المرتجعات', POS: 'نقطة البيع',
  Delivery: 'التوصيل', Deliveries: 'الشحنات', Zones: 'مناطق التوصيل', Riders: 'المندوبون',
  COD: 'الدفع عند الاستلام', Receipts: 'الإيصالات', Customers: 'العملاء',
  Discounts: 'التخفيضات', Reviews: 'التقييمات', CMS: 'إدارة المحتوى', Pages: 'الصفحات',
  Menus: 'القوائم', Storefront: 'واجهة المتجر', Reports: 'التقارير', Expenses: 'المصاريف',
  Media: 'الوسائط', Staff: 'فريق العمل', 'Audit Log': 'سجل النشاط', Settings: 'الإعدادات',
  Courses: 'الدورات', Services: 'الخدمات', Listings: 'العقارات',
  'E-commerce': 'التجارة الإلكترونية', 'Course Management': 'إدارة الدورات',
  'Service Management': 'إدارة الخدمات', 'Real Estate': 'العقارات',
}
function labelAr(label: string): string { return NAV_AR[label] ?? label }
function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}
interface NavGroupData { key: string; label: string; items: NavItem[] }
function groupMainNav(main: NavItem[]): NavGroupData[] {
  const groups: NavGroupData[] = []
  const indexByKey = new Map<string, number>()
  for (const item of main) {
    const key = item.moduleKey ?? item.href
    let index = indexByKey.get(key)
    if (index === undefined) {
      index = groups.length
      indexByKey.set(key, index)
      groups.push({ key, label: item.moduleKey ? MODULES[item.moduleKey].name : item.label, items: [] })
    }
    groups[index].items.push(item)
  }
  return groups
}
export function Sidebar({ org, orgs, nav, collapsed = false, onNavigate, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const dashboard = nav.core.find((item) => item.href === '/admin')
  const bottomCore = nav.core.filter((item) => item.href !== '/admin')
  const groups = React.useMemo(() => groupMainNav(nav.main), [nav.main])
  return (
    <div dir="rtl" className="flex h-full flex-col bg-sidebar">
      <div className={cn('flex h-16 shrink-0 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center px-0')}>
        {collapsed ? (
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">S</span>
        ) : (
          <span className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-sidebar-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">S</span>
            Sougify
          </span>
        )}
      </div>
      <div className="border-b border-sidebar-border/80 p-3">
        <OrgSwitcher orgs={orgs} activeOrgId={org.id} activeOrgName={org.name} collapsed={collapsed} />
      </div>
      <nav aria-label="القائمة الرئيسية" className="flex-1 overflow-y-auto px-3 py-4">
        {dashboard && <NavLink item={dashboard} active={isActive(pathname, dashboard.href)} collapsed={collapsed} onNavigate={onNavigate} />}
        <div className="mt-5 flex flex-col gap-1">
          {groups.map((group) => group.items.length > 1 ? (
            <NavGroup key={group.key} label={labelAr(group.label)} items={group.items} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
          ) : (
            <NavLink key={group.items[0].href} item={group.items[0]} active={isActive(pathname, group.items[0].href)} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-1 border-t border-sidebar-border/80 pt-4">
          {bottomCore.map((item) => <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onNavigate={onNavigate} />)}
        </div>
      </nav>
      {onToggleCollapse && (
        <div className="border-t border-sidebar-border p-2">
          <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
            className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground', collapsed && 'justify-center px-0')}>
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && <span>طي القائمة</span>}
          </button>
        </div>
      )}
    </div>
  )
}
function NavLink({ item, active, collapsed, onNavigate, indent }: {
  item: NavItem; active: boolean; collapsed?: boolean; onNavigate?: () => void; indent?: boolean
}) {
  const Icon = getIcon(item.icon)
  const label = labelAr(item.label)
  const link = (
    <Link href={item.href} onClick={onNavigate}
      className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
        active ? 'bg-primary/10 text-primary shadow-sm' : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        collapsed && 'justify-center px-0', indent && !collapsed && 'pr-8')}>
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
  if (!collapsed) return link
  return <Tooltip><TooltipTrigger asChild>{link}</TooltipTrigger><TooltipContent side="left">{label}</TooltipContent></Tooltip>
}
function NavGroup({ label, items, pathname, collapsed, onNavigate }: {
  label: string; items: NavItem[]; pathname: string; collapsed?: boolean; onNavigate?: () => void
}) {
  const hasActiveChild = items.some((item) => isActive(pathname, item.href))
  const [open, setOpen] = React.useState(true)
  if (collapsed) return <>{items.map((item) => <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} collapsed onNavigate={onNavigate} />)}</>
  return (
    <div>
      <button type="button" onClick={() => setOpen((value) => !value)}
        className={cn('flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors hover:text-sidebar-foreground', hasActiveChild && 'text-sidebar-foreground')}>
        {label}<ChevronDown className={cn('size-3.5 transition-transform', !open && 'rotate-90')} />
      </button>
      {open && <div className="flex flex-col gap-0.5">{items.map((item) => <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={false} onNavigate={onNavigate} indent />)}</div>}
    </div>
  )
}
