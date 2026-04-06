// ============================================================================
// SHARED TYPES — Calculator
// ============================================================================

import type { KkmType, KkmTypeConfig } from '@/config/services'
import type { OfdPeriod } from '@/config/ofd'

export type Step = 1 | 2 | 3 | 4
export type KkmCondition = 'new' | 'used' | 'old' | ''
export type OfdPeriodType = OfdPeriod

// Re-export for convenience
export type { KkmType, KkmTypeConfig }

// Client data stored in state
export interface ClientData {
  name: string
  inn: string
  phone: string
  email: string
  address: string
  kkmModel: string
  kkmNumber: string
  fnNumber: string
  comment: string
  evotorLogin: string
  evotorPassword: string
  hasEcp: boolean
  fnActivityType: string
  sellsExcise: boolean
}

// Total calculation result
export interface TotalCalc {
  items: { name: string; price: number }[]
  total: number
}

// HintButton props
export interface HintButtonProps {
  hintKey: string
  activeHint: string | null
  onHintOpen: (key: string) => void
  onHintClose: () => void
}

// DoneScreen props
export interface DoneScreenProps {
  effectiveKkmInfo: { name: string }
  kkmCondition: string
  clientData: ClientData
  totalCalc: TotalCalc
  onBack: () => void
  onPrint: () => void
  onClose: () => void
  kkmType: string
  effectiveKkm: string
  step2Selections: string[]
  step3Selections: string[]
  scannerChecked: boolean
  fnChecked: boolean
  productCardCount: number
  serviceContractChecked: boolean
  evotorRestore: boolean
  sigmaHelpChecked: boolean
  unsureFnsRegistration: boolean
  orderNum: string | null
  isCorrection: boolean
}

// generateOrderHtml params
export interface GenerateOrderHtmlParams {
  effectiveKkmInfo: { name: string }
  kkmCondition: string
  kkmType: string
  clientData: ClientData
  totalCalc: TotalCalc
  step2Selections: string[]
  step3Selections: string[]
  scannerChecked: boolean
  fnChecked: boolean
  productCardCount: number
  serviceContractChecked: boolean
  evotorRestore: boolean
  sigmaHelpChecked: boolean
  unsureFnsRegistration: boolean
  includeChecklist?: boolean
  isCorrection?: boolean
  correctionTime?: string | null
  orderNum?: string
}
