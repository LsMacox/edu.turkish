import { sanitizePhone } from '../useInternationalPhone'
import { useFormValidation } from '../useFormValidation'

export interface ApplicationModalFormData {
  name: string
  phone: string
  email: string
  message: string
  agreement: boolean
}

export const useApplicationModalValidation = () => {
  const validation = useFormValidation()

  const applicationModalRules = {
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
    message: [validation.createRules.maxLength(500, 'Message must not exceed 500 characters')],
    agreement: [
      validation.createRules.custom((value: boolean) => value || 'You must agree to the privacy policy'),
    ],
  }

  const validateApplicationModal = async (form: ApplicationModalFormData) => {
    Object.keys(applicationModalRules).forEach((field) => validation.touchField(field))

    const sanitizedPhone = sanitizePhone(form.phone)

    return validation.validateFields({
      name: { value: form.name, rules: applicationModalRules.name },
      phone: { value: sanitizedPhone, rules: applicationModalRules.phone },
      email: { value: form.email, rules: applicationModalRules.email },
      message: { value: form.message ?? '', rules: applicationModalRules.message },
      agreement: { value: form.agreement, rules: applicationModalRules.agreement },
    })
  }

  return {
    ...validation,
    applicationModalRules,
    validateApplicationModal,
  }
}
