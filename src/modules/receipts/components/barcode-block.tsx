import { code128Svg } from '@/lib/barcode/code128'

// Shared print template component — renders inside print.css's `.barcode-block`.
// No 'use client': dangerouslySetInnerHTML works fine in a Server Component, and
// code128Svg is a pure string-building function (no DOM/canvas dependency).

interface BarcodeBlockProps {
  /** The tracking/consignment code to encode (Code128-B: ASCII 32-126 only). */
  code: string
  /** Caption under the bars — defaults to the code itself, rendered in `.mono-code`. */
  caption?: string
  height?: number
}

export function BarcodeBlock({ code, caption, height = 60 }: BarcodeBlockProps) {
  const svg = code128Svg(code, { height })
  const label = caption ?? code

  return (
    <div className="barcode-block">
      {/* eslint-disable-next-line react/no-danger -- server-generated SVG string, no user HTML */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      {label ? <div className="barcode-caption mono-code">{label}</div> : null}
    </div>
  )
}
