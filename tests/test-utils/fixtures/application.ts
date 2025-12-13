import type { LeadData } from '~~/lib/types/server'

export type ApplicationFixture = LeadData

let applicationIdCounter = 1

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
  }

  return { ...defaults, ...overrides }
}
