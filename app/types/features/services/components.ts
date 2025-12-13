export interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  icon: string
}

export interface TrustFactor {
  title: string
  description: string
  icon: string
}

export interface PackageTier {
  name: string
  targetScore: string
}

export interface ProgramItem {
  title: string
  description: string
  icon: string
}

export interface CaseStudy {
  before?: number
  after?: number
  score?: number
  duration?: string
  proof?: string
  admission?: string
}

export interface ServiceCard {
  title: string
  description: string
  icon: string // Iconify icon name
}
