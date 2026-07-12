import type { DeliveryCourier } from '@/types/db'
import { ConfigRequiredError } from './types'
import type { CourierAdapter } from './types'
import { manualAdapter } from './manual'
import { steadfastAdapter } from './steadfast'
import { pathaoAdapter } from './pathao'

export * from './types'

const ADAPTERS: Partial<Record<DeliveryCourier, CourierAdapter>> = {
  manual: manualAdapter,
  steadfast: steadfastAdapter,
  pathao: pathaoAdapter,
}

/**
 * docs/architecture.md §8 — getAdapter(courier). 'redx' has no adapter
 * implemented yet: it throws the same ConfigRequiredError shape as an
 * unconfigured steadfast/pathao account, so callers get one consistent
 * error-handling path (toast + suggest switching to manual).
 */
export function getAdapter(courier: DeliveryCourier): CourierAdapter {
  const adapter = ADAPTERS[courier]
  if (!adapter) {
    throw new ConfigRequiredError(`${courier} isn't supported yet — use manual tracking instead`)
  }
  return adapter
}
