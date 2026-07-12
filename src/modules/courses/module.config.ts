import type { ModuleDef } from '@/modules/types'

export const config: ModuleDef = {
  key: 'courses',
  name: 'Courses',
  description: 'Online courses, lessons, and enrollments.',
  nav: [{ label: 'Courses', href: '/admin/courses', icon: 'GraduationCap' }],
  dashboardWidgets: ['enrollments-recent'],
}
