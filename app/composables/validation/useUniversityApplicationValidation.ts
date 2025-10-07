import { sanitizePhone } from '../useInternationalPhone'
import { useFormValidation } from '../useFormValidation'

export interface UniversityApplicationFormData {
  name: string
  phone: string
  email: string
  program: string
  level: string
  comment: string
  privacyAgreed: boolean
}

export const useUniversityApplicationValidation = () => {
  const validation = useFormValidation()

  const universityApplicationRules = {
    name: [
      validation.createRules.required('Name is required'),
      validation.createRules.minLength(2, 'Name must be at least 2 characters'),
      validation.createRules.maxLength(50, 'Name must not exceed 50 characters'),
    ],
    phone: [
      validation.createRules.required('Phone number is required'),
      validation.createRules.phone('Please enter a valid phone number'),
    ],
    email: [validation.createRules.email('Please enter a valid email address')],
    program: [validation.createRules.required('Please select a program of interest')],
    level: [validation.createRules.required('Please choose your study level')],
    comment: [validation.createRules.maxLength(500, 'Comment must not exceed 500 characters')],
    privacyAgreed: [
      validation.createRules.custom(
        (value: boolean) => value || 'You must agree to personal data processing',
      ),
    ],
  }

  const validateUniversityApplication = async (form: UniversityApplicationFormData) => {
    Object.keys(universityApplicationRules).forEach((field) => validation.touchField(field))

    const sanitizedPhone = sanitizePhone(form.phone)

    return validation.validateFields({
      name: { value: form.name, rules: universityApplicationRules.name },
      phone: { value: sanitizedPhone, rules: universityApplicationRules.phone },
      email: { value: form.email, rules: universityApplicationRules.email },
      program: { value: form.program, rules: universityApplicationRules.program },
      level: { value: form.level, rules: universityApplicationRules.level },
      comment: { value: form.comment ?? '', rules: universityApplicationRules.comment },
      privacyAgreed: { value: form.privacyAgreed, rules: universityApplicationRules.privacyAgreed },
    })
  }

  return {
    ...validation,
    universityApplicationRules,
    validateUniversityApplication,
  }
}
