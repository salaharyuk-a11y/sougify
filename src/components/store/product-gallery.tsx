'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const hasImages = images.length > 0
  const src = hasImages ? images[Math.min(active, images.length - 1)] : null

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                'size-16 shrink-0 overflow-hidden rounded-md border transition-colors',
                i === active ? 'border-primary' : 'border-border hover:border-foreground/30',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
