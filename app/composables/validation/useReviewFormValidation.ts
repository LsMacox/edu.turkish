import { useFormValidation } from '../useFormValidation'

export interface ReviewFormData {
  name: string
  university: string
  rating: string
  review: string
}

export const useReviewFormValidation = () => {
  const validation = useFormValidation()

  const reviewFormRules = {
    name: [
      validation.createRules.required('Please enter your name'),
      validation.createRules.minLength(2, 'Name must be at least 2 characters'),
    ],
    university: [validation.createRules.required('Please select a university')],
    rating: [validation.createRules.required('Please choose a rating')],
    review: [
      validation.createRules.required('Please share your experience'),
      validation.createRules.minLength(50, 'Review must be at least 50 characters long'),
    ],
  }

  const validateReviewForm = async (form: ReviewFormData) => {
    Object.keys(reviewFormRules).forEach((field) => validation.touchField(field))

    return validation.validateFields({
      name: { value: form.name, rules: reviewFormRules.name },
      university: { value: form.university, rules: reviewFormRules.university },
      rating: { value: form.rating, rules: reviewFormRules.rating },
      review: { value: form.review, rules: reviewFormRules.review },
    })
  }

  return {
    ...validation,
    reviewFormRules,
    validateReviewForm,
  }
}
