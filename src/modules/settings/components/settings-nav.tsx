'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SettingsNavProps {
  sections: { id: string; label: string }[]
}

function SettingsNav({ sections }: SettingsNavProps) {
  const [activeId, setActiveId] = React.useState(sections[0]?.id)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -70% 0px' },
    )
    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="أقسام الإعدادات" className="sticky top-6 flex w-48 shrink-0 flex-col gap-1 self-start max-lg:w-40 max-md:static max-md:w-full max-md:flex-row max-md:overflow-x-auto max-md:pb-2">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? 'location' : undefined}
          className={cn(
            'shrink-0 rounded-md px-3 py-2 text-sm transition-colors',
            activeId === section.id
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}

export { SettingsNav }
