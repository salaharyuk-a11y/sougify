// Monetary values are stored as integer minor units (1 DZD = 100 centimes).
// Keep arithmetic in integers and convert only when formatting for display.

const DZD_SYMBOL = 'دج'

export function fromPaisa(minorUnits: number): number { return minorUnits / 100 }

/** Legacy function name retained for compatibility; values are generic minor units. */
export function toPaisa(amount: string | number): number {
  const raw = String(amount).trim()
  if (raw === '' || raw === '-') return 0
  const negative = raw.startsWith('-')
  const clean = (negative ? raw.slice(1) : raw).replace(/,/g, '')
  const [wholeRaw, fractionRaw = ''] = clean.split('.')
  const whole = wholeRaw === '' ? '0' : wholeRaw
  const fraction = (fractionRaw + '000').slice(0, 3)
  let units = Number(whole) * 100 + Number(fraction.slice(0, 2))
  if (Number(fraction[2] ?? '0') >= 5) units += 1
  return negative ? -units : units
}

function formattedAmount(minorUnits: number): string {
  const negative = minorUnits < 0
  const absolute = Math.abs(Math.round(minorUnits))
  const whole = Math.floor(absolute / 100)
  const fraction = absolute % 100
  const amount = whole.toLocaleString('fr-DZ')
  return `${negative ? '-' : ''}${amount}${fraction ? `,${String(fraction).padStart(2, '0')}` : ''}`
}

/** Formats an integer amount stored in centimes as Algerian dinars. */
export function formatMoney(minorUnits: number, opts?: { symbol?: boolean }): string {
  const amount = formattedAmount(minorUnits)
  return opts?.symbol === false ? amount : `${amount} ${DZD_SYMBOL}`
}

const ONES = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf']
const TENS = ['','','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingts','quatre-vingt-dix']
function underThousand(n: number): string {
  if (n < 20) return ONES[n]
  if (n < 100) {
    const ten = Math.floor(n / 10), unit = n % 10
    if (ten === 7 || ten === 9) return `${TENS[ten - 1]}-${ONES[10 + unit]}`
    return unit ? `${TENS[ten]}-${ONES[unit]}` : TENS[ten]
  }
  const hundred = Math.floor(n / 100), rest = n % 100
  return `${hundred === 1 ? 'cent' : `${ONES[hundred]} cent`}${rest ? ` ${underThousand(rest)}` : hundred > 1 ? 's' : ''}`
}
function integerToWords(n: number): string {
  if (n === 0) return 'zéro'
  const billions = Math.floor(n / 1_000_000_000)
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000)
  const thousands = Math.floor((n % 1_000_000) / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (billions) parts.push(`${underThousand(billions)} milliard${billions > 1 ? 's' : ''}`)
  if (millions) parts.push(`${underThousand(millions)} million${millions > 1 ? 's' : ''}`)
  if (thousands) parts.push(thousands === 1 ? 'mille' : `${underThousand(thousands)} mille`)
  if (rest) parts.push(underThousand(rest))
  return parts.join(' ')
}

/** French wording for Algerian receipts, in dinars and centimes. */
export function moneyToWords(minorUnits: number): string {
  const negative = minorUnits < 0
  const absolute = Math.abs(Math.round(minorUnits))
  const dinars = Math.floor(absolute / 100)
  const centimes = absolute % 100
  const words = `${negative ? 'moins ' : ''}${integerToWords(dinars)} dinar${dinars > 1 ? 's' : ''}${centimes ? ` et ${integerToWords(centimes)} centime${centimes > 1 ? 's' : ''}` : ''}`
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Compact DZD amount: 1,2 k / 1,2 M / 1,2 Md. */
export function formatCompact(minorUnits: number, opts?: { symbol?: boolean }): string {
  const value = Math.abs(minorUnits) / 100
  const negative = minorUnits < 0 ? '-' : ''
  let compact: string
  if (value >= 1_000_000_000) compact = `${(value / 1_000_000_000).toLocaleString('fr-DZ', { maximumFractionDigits: 1 })} Md`
  else if (value >= 1_000_000) compact = `${(value / 1_000_000).toLocaleString('fr-DZ', { maximumFractionDigits: 1 })} M`
  else if (value >= 1_000) compact = `${(value / 1_000).toLocaleString('fr-DZ', { maximumFractionDigits: 1 })} k`
  else compact = value.toLocaleString('fr-DZ', { maximumFractionDigits: 2 })
  return `${negative}${compact}${opts?.symbol === false ? '' : ` ${DZD_SYMBOL}`}`
}
