import { useFormValidation } from '../useFormValidation'

export interface ContactFormData {
  name: string
  phone: string
  email: string
  message?: string
}

export const useContactFormValidation = () => {
  const validation = useFormValidation()

  const contactFormRules = {
    name: [
      validation.createRules.required('Name is required'),
      validation.createRules.minLength(2, 'Name must be at least 2 characters'),
      validation.createRules.maxLength(50, 'Name must not exceed 50 characters'),
      validation.createRules.pattern(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    ],
    phone: [
      validation.createRules.required('Phone number is required'),
      validation.createRules.phone('Please enter a valid Turkish phone number'),
    ],
    email: [
      validation.createRules.required('Email is required'),
      validation.createRules.email('Please enter a valid email address'),
    ],
    message: [validation.createRules.maxLength(500, 'Message must not exceed 500 characters')],
  }

  const validateContactForm = async (form: ContactFormData) => {
    Object.keys(contactFormRules).forEach((field) => validation.touchField(field))

    return validation.validateFields({
      name: { value: form.name, rules: contactFormRules.name },
      phone: { value: form.phone, rules: contactFormRules.phone },
      email: { value: form.email, rules: contactFormRules.email },
      message: { value: form.message ?? '', rules: contactFormRules.message },
    })
  }

  return {
    ...validation,
    contactFormRules,
    validateContactForm,
  }
}
