import type { LeadData } from '~~/server/types/crm'

let applicationIdCounter = 1

export type ApplicationFixture = LeadData

export function createApplication(overrides?: Partial<ApplicationFixture>): ApplicationFixture {
  const id = applicationIdCounter++

  const defaults: ApplicationFixture = {
    firstName: `FirstName${id}`,
    lastName: `LastName${id}`,
    phone: `+7700${String(id).padStart(7, '0')}`,
    email: `user${id}@example.com`,
    referralCode: `REF${id}`,
    source: 'website',
    userType: 'student',
    language: 'english',
    universities: [],
    scholarship: 'no',
    utm: {
      source: 'organic',
      medium: 'none',
      campaign: '',
    },
  }

  return {
    ...defaults,
    ...overrides,
    utm: overrides?.utm ? { ...defaults.utm, ...overrides.utm } : defaults.utm,
  }
}
