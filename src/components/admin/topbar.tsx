'use client'

import { Menu, Search } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationsBell } from '@/components/admin/notifications-bell'
import { ThemeToggle } from '@/components/admin/theme-toggle'
// A1 slice owns src/lib/actions/auth.ts (logoutAction) — landing by integration time.
import { logoutAction } from '@/lib/actions/auth'
import type { Role } from '@/types/db'

interface TopbarProps {
  orgName: string
  user: { name: string; email: string }
  role: Role
  unreadCount: number
  onMenuClick: () => void
  onSearchClick: () => void
}

const ROLE_LABEL_AR: Record<string, string> = { owner: 'مالك المؤسسة', admin: 'مدير', manager: 'مشرف', staff: 'موظف', accountant: 'محاسب' }\n\nfunction initialsOf(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return initials || 'U'
}

export function Topbar({ orgName, user, role, unreadCount, onMenuClick, onSearchClick }: TopbarProps) {
  function handleLogout() {
    // logoutAction redirects to /login on success — fire and forget.
    void logoutAction()
  }

  return (
    <header dir="rtl" className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
        >
          <Menu className="size-4" />
        </Button>
        <div className="flex min-w-0 flex-col leading-tight"><span className="truncate text-sm font-semibold text-foreground">{orgName}</span><span className="text-[11px] text-muted-foreground">مساحة العمل</span></div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onSearchClick}
          className="hidden gap-2 text-muted-foreground sm:flex"
        >
          <Search className="size-3.5" />
          <span className="text-xs">بحث في Sougify</span>
          <kbd className="ml-2 rounded border border-border bg-muted px-1 text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSearchClick}
          className="sm:hidden"
          aria-label="بحث"
        >
          <Search className="size-4" />
        </Button>

        <NotificationsBell initialUnreadCount={unreadCount} />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-7">
              <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              <span className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                {role}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>تسجيل الخروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
