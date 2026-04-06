// ============================================================================
// ОФД — провайдеры
// ============================================================================

import type { KkmType } from './services'

export type OfdPeriod = '15' | '36'

export interface OfdProvider {
  id: string
  name: string
  shortName: string
  periods: Record<OfdPeriod, { price: number; originalPrice: number }>
  partner?: boolean
}

export const OFD_PROVIDERS: OfdProvider[] = [
  {
    id: 'takskom',
    name: 'ОФД ТАКСКОМ',
    shortName: 'ТАКСКОМ',
    partner: true,
    periods: {
      '15': { price: 6400, originalPrice: 6900 },
      '36': { price: 11000, originalPrice: 12000 }
    }
  },
  {
    id: 'platform_ofd',
    name: 'Платформа ОФД',
    shortName: 'Платформа ОФД',
    periods: {
      '15': { price: 4000, originalPrice: 4500 },
      '36': { price: 8500, originalPrice: 9500 }
    },
  },
  {
    id: 'first_ofd',
    name: 'ПЕРВЫЙ ОФД',
    shortName: 'ПЕРВЫЙ ОФД',
    periods: {
      '15': { price: 3100, originalPrice: 3600 },
      '36': { price: 6600, originalPrice: 7600 }
    }
  },
  {
    id: 'sbis_tensor',
    name: 'СБИС ТЕНЗОР',
    shortName: 'СБИС ТЕНЗОР',
    periods: {
      '15': { price: 4000, originalPrice: 4500 },
      '36': { price: 9000, originalPrice: 10000 }
    }
  }
]
