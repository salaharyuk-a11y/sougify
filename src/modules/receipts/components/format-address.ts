// Shared helper — orders/deliveries store address as jsonb ({ line1, area, district,
// postcode }); print templates (invoice + label) both need to flatten it to text.

export interface AddressLike {
  line1?: string
  area?: string
  district?: string
  postcode?: string
}

export function formatAddress(address: Record<string, unknown> | null | undefined): string {
  if (!address) return ''
  const { line1, area, district, postcode } = address as AddressLike
  return [line1, area, district, postcode].filter(Boolean).join(', ')
}
