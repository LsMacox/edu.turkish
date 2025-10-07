export function validateApplicationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.personal_info?.first_name?.trim()) {
    errors.push('First name is required')
  }

  if (data.personal_info?.email?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_info.email)) {
      errors.push('Invalid email format')
    }
  }

  if (!data.personal_info?.phone?.trim()) {
    errors.push('Phone number is required')
  } else {
    const digits = String(data.personal_info.phone).replace(/\D/g, '')
    if (digits.length < 10) {
      errors.push('Phone number must contain at least 10 digits')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
