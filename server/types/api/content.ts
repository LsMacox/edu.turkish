export interface AboutContent {
  mission: string
  story: string
  values: Array<{ title: string; description: string }>
  guarantees: Array<{ title: string; description: string }>
  contact_info: {
    email: string
    phone: string
    whatsapp: string
    address: string
  }
  working_hours: {
    weekdays: string
    weekends: string
    timezone: string
  }
}
