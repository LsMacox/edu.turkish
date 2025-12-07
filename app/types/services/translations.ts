export interface DocumentType {
  name: string
  priceUsd: number | null // null for "by request" option
}

export interface UrgencyOption {
  name: string
  surcharge: number // USD surcharge amount (0 for standard, 10 for rush, etc.)
}

export interface CalculatorSubmitEvent {
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string // "от 30$" or "По запросу"
}
