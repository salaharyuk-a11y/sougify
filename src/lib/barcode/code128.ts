/**
 * Pure-TS Code128 (subset B) barcode generator — emits a self-contained SVG string.
 * No canvas/DOM dependency, so it is safe to call from Server Components / server
 * actions and inline via dangerouslySetInnerHTML on print pages (docs/architecture.md §9,
 * §2 "Receipts & printing" — "Code128 barcode SVG (src/lib/barcode/code128.ts — pure TS)").
 *
 * Code128-B covers ASCII 32 (space) through 126 (~): value(char) = charCode - 32.
 * That covers every character actually used here (order numbers, tracking/consignment
 * codes, SKUs) — anything outside that range throws rather than silently emitting a
 * barcode that won't scan.
 *
 * Self-check (hand-derived, cross-checked against a throwaway Node script during
 * authoring — table integrity, digit-shape, and both checksums below all verified):
 *   encodeCode128B("ABC")     => [104(START B), 33('A'), 34('B'), 35('C'), 1(checksum), 106(STOP)]
 *     checksum = 104 + 33*1 + 34*2 + 35*3 = 310; 310 % 103 = 1 ✓
 *     total modules = 11 + 11 + 11 + 11 + 11 + 13 = 68
 *   encodeCode128B("PJJ123C") => [...,55(checksum), 106(STOP)]
 *     checksum = 104 + 48*1 + 42*2 + 42*3 + 17*4 + 18*5 + 19*6 + 35*7 = 879; 879 % 103 = 55 ✓
 */

export interface Code128Options {
  /** Bar height in SVG user units (~px). Default 60. */
  height?: number
  /** Render the human-readable text under the bars. Default false. */
  showText?: boolean
}

// Value -> module-width pattern. Index = symbol value:
//   0-102  data/special characters
//   103    START A
//   104    START B  (the only start symbol this module emits)
//   105    START C
//   106    STOP
// Each pattern is 6 digits (bar,space,bar,space,bar,space widths, 1-4 modules each,
// summing to 11) except STOP, which has 7 digits (bar,space,bar,space,bar,space,bar,
// summing to 13). This is the standard Code 128 symbology table (ISO/IEC 15417) — the
// same constant reproduced by every independent Code128 encoder (browser barcode libs,
// thermal/label printer SDKs, etc.), not something specific to this implementation.
const PATTERNS: readonly string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213',
  '122312', '132212', '221213', '221312', '231212', '112232', '122132',
  '122231', '113222', '123122', '123221', '223211', '221132', '221231',
  '213212', '223112', '312131', '311222', '321122', '321221', '312212',
  '322112', '322211', '212123', '212321', '232121', '111323', '131123',
  '131321', '112313', '132113', '132311', '211313', '231113', '231311',
  '112133', '112331', '132131', '113123', '113321', '133121', '313121',
  '211331', '231131', '213113', '213311', '213131', '311123', '311321',
  '331121', '312113', '312311', '332111', '314111', '221411', '431111',
  '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114',
  '413111', '241112', '134111', '111242', '121142', '121241', '114212',
  '124112', '124211', '411212', '421112', '421211', '212141', '214121',
  '412121', '111143', '111341', '131141', '114113', '114311', '411113',
  '411311', '113141', '114131', '311141', '411131', '211412', '211214',
  '211232', '2331112',
]

const START_B = 104
const STOP = 106
const MODULE_UNITS = 2 // svg user-units per narrow module
const QUIET_ZONE_MODULES = 10 // blank margin each side (spec minimum ~10x module width)

function charToValue(ch: string): number {
  const code = ch.charCodeAt(0)
  if (code < 32 || code > 126) {
    throw new Error(
      `code128Svg: unsupported character ${JSON.stringify(ch)} (Code128-B covers ASCII 32-126)`,
    )
  }
  return code - 32
}

/** Encodes text into the full Code128-B symbol-value sequence: START..data..checksum..STOP. */
export function encodeCode128B(text: string): number[] {
  if (!text) throw new Error('code128Svg: text must not be empty')

  const data = Array.from(text).map(charToValue)

  let checksum = START_B
  data.forEach((value, i) => {
    checksum += value * (i + 1)
  })
  checksum %= 103

  return [START_B, ...data, checksum, STOP]
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Renders a Code128-B barcode as a standalone SVG string. Pure string building — no
 * DOM/canvas — so it works in RSC / server actions and can be inlined via
 * dangerouslySetInnerHTML on print pages.
 */
export function code128Svg(text: string, opts?: { height?: number; showText?: boolean }): string {
  const height = opts?.height ?? 60
  const showText = opts?.showText ?? false

  const symbols = encodeCode128B(text)
  const patterns = symbols.map((value) => PATTERNS[value])

  const totalModules =
    patterns.reduce(
      (sum, pattern) => sum + pattern.split('').reduce((s, digit) => s + Number(digit), 0),
      0,
    ) +
    QUIET_ZONE_MODULES * 2

  const barHeight = height
  const textHeight = showText ? Math.round(height * 0.28) : 0
  const svgHeight = barHeight + textHeight
  const svgWidth = totalModules * MODULE_UNITS

  let x = QUIET_ZONE_MODULES * MODULE_UNITS
  const rects: string[] = []

  for (const pattern of patterns) {
    let isBar = true
    for (const digit of pattern) {
      const width = Number(digit) * MODULE_UNITS
      if (isBar) {
        rects.push(`<rect x="${x}" y="0" width="${width}" height="${barHeight}" fill="#000"/>`)
      }
      x += width
      isBar = !isBar
    }
  }

  const textEl = showText
    ? `<text x="${svgWidth / 2}" y="${svgHeight - 2}" text-anchor="middle" font-family="'Courier New', ui-monospace, monospace" font-size="${Math.round(textHeight * 0.9)}" fill="#000">${escapeXml(text)}</text>`
    : ''

  return `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(`Barcode ${text}`)}"><rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#fff"/>${rects.join('')}${textEl}</svg>`
}
