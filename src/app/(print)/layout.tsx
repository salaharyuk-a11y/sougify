import type { ReactNode } from 'react'

import '@/styles/print.css'
import { PrintButton } from '@/components/ui/print-button'

// (print) nests under the root layout (src/app/layout.tsx), which already renders
// <html>/<body> and loads globals.css/Toaster — this layout only adds the print
// stylesheet and a screen-only toolbar. docs/conventions.md: "Print pages: bare
// layout, load src/styles/print.css, <PrintButton/> client comp calling window.print()."

export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-2 shadow-xs">
        <p className="text-sm text-zinc-600">
          Use your browser&apos;s print dialog to save as PDF or send to a printer. This
          toolbar never appears in the printed output — close the tab when you&apos;re done.
        </p>
        <PrintButton />
      </div>
      <div className="py-6">{children}</div>
    </div>
  )
}
