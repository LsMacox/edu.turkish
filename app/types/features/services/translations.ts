export interface DocumentType {
  name: string
  priceUsd: number | null
}

export interface UrgencyOption {
  name: string
  surcharge: number
}

export interface CalculatorSubmitEvent {
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string
}
