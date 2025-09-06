<template>
  <section class="py-20 bg-gradient-to-r from-primary to-red-600">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12 text-white">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6">
            {{ $t('applicationCTA.title', { universityName: university.name }) }}
          </h2>
          <p class="text-xl opacity-90">
            {{ $t('applicationCTA.subtitle') }}
          </p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <form @submit.prevent="submitApplication" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.name_label') }}</label>
                <UiFormsBaseTextField
                  v-model="form.name"
                  type="text" 
                  :placeholder="$t('applicationCTA.form.name_placeholder')"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.phone_label') }}</label>
                <div class="relative">
                  <input 
                    v-model="form.phone"
                    type="tel" 
                    required
                    :placeholder="$t('applicationCTA.form.phone_placeholder')"
                    inputmode="tel"
                    autocomplete="tel"
                    maxlength="18"
                    @input="onPhoneInput"
                    @keydown="onPhoneKeydown"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200"
                  >
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.email_label') }}</label>
              <UiFormsBaseTextField
                v-model="form.email"
                type="email" 
                :placeholder="$t('applicationCTA.form.email_placeholder')"
              />
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.program_label') }} *</label>
                <UiFormsBaseSelect v-model="form.program" required>
                  <option value="">{{ $t('applicationCTA.form.program_placeholder') }}</option>
                  <option v-for="program in availablePrograms" :key="program" :value="program">
                    {{ program }}
                  </option>
                  <option value="other">{{ $t('applicationCTA.form.program_other') }}</option>
                </UiFormsBaseSelect>
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.level_label') }}</label>
                <UiFormsBaseSelect v-model="form.level">
                  <option value="bachelor">{{ $t('applicationCTA.form.level_bachelor') }}</option>
                  <option value="master">{{ $t('applicationCTA.form.level_master') }}</option>
                </UiFormsBaseSelect>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-secondary mb-2">{{ $t('applicationCTA.form.comment_label') }}</label>
              <textarea 
                v-model="form.comment"
                rows="4" 
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200 resize-none" 
                :placeholder="$t('applicationCTA.form.comment_placeholder')"
              ></textarea>
            </div>
            
            <UiFormsBaseCheckbox 
              :checked="form.privacyAgreed"
              @update:checked="form.privacyAgreed = $event"
            >
              {{ $t('applicationCTA.form.privacy_agreement') }}
            </UiFormsBaseCheckbox>
            
            <div class="text-center">
              <button 
                type="submit" 
                :disabled="isSubmitting || !form.privacyAgreed"
                class="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                <span v-if="!isSubmitting">{{ $t('applicationCTA.form.submit_button') }}</span>
                <span v-else class="flex items-center justify-center space-x-2">
                  <Icon name="ph:spinner" class="animate-spin" />
                  <span>{{ $t('applicationCTA.form.submitting') }}</span>
                </span>
              </button>
              <p class="text-sm text-gray-500 mt-3">
                {{ $t('applicationCTA.form.response_time') }}
              </p>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { show } = useToast()

interface Props {
  university: {
    name: string
    academicPrograms?: Array<{
      name: string
      level: 'bachelor' | 'master'
      language: string
      duration: string
      price: number
    }>
  }
}

const props = defineProps<Props>()

const form = ref({
  name: '',
  phone: '',
  email: '',
  program: '',
  level: 'bachelor' as 'bachelor' | 'master',
  comment: '',
  privacyAgreed: false
})

const isSubmitting = ref(false)

// Get available programs based on university data
const availablePrograms = computed(() => {
  const programs = props.university.academicPrograms
  if (!programs) return []
  
  const level = form.value.level
  return programs
    .filter(program => program.level === level)
    .map(program => program.name)
})

// Страна-aware визуальная маска для CTA (см. модалку)
const formatInternationalPhone = (raw: string) => {
  const input = raw.replace(/[^+\d]/g, '')
  const hasPlus = input.startsWith('+')
  const digits = input.replace(/\D/g, '')

  if (digits.length === 0) return ''

  const startsWith7 = hasPlus ? input.startsWith('+7') : digits.startsWith('7')
  const startsWith90 = hasPlus ? input.startsWith('+90') : digits.startsWith('90')

  if (startsWith7) {
    const body = digits.slice(1, 11)
    let res = '+7'
    if (body.length === 0) return res
    res += ' (' + body.slice(0, 3)
    if (body.length >= 3) res += ') '
    if (body.length > 3) res += body.slice(3, 6)
    if (body.length >= 6) res += ' ' + body.slice(6, 8)
    if (body.length >= 8) res += '-' + body.slice(8, 10)
    return res.trim()
  }

  if (startsWith90) {
    const body = digits.slice(2, 12)
    let res = '+90'
    if (body.length === 0) return res
    res += ' (' + body.slice(0, 3)
    if (body.length >= 3) res += ') '
    if (body.length > 3) res += body.slice(3, 6)
    if (body.length >= 6) res += ' ' + body.slice(6, 8)
    if (body.length >= 8) res += '-' + body.slice(8, 10)
    return res.trim()
  }

  const limited = digits.slice(0, 15)
  const groups = limited.match(/\d{1,3}/g) || []
  return (hasPlus || limited.length > 0 ? '+' : '') + groups.join(' ')
}

const onPhoneInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  form.value.phone = formatInternationalPhone(el.value)
}

const onPhoneKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const el = e.target as HTMLInputElement
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const value = el.value
  if (start !== end || start === 0) return
  const leftChar = value[start - 1] || ''
  if (/\d/.test(leftChar)) return
  e.preventDefault()
  const digits = value.replace(/\D/g, '')
  const newDigits = digits.slice(0, -1)
  const newRaw = newDigits.length ? ('+' + newDigits) : ''
  form.value.phone = formatInternationalPhone(newRaw)
}

const submitApplication = async () => {
  if (!form.value.privacyAgreed) {
    show('Необходимо согласиться на обработку персональных данных', { 
      title: 'Заполните все поля', 
      type: 'warning', 
      duration: 3000 
    })
    return
  }

  if (!form.value.name.trim() || !form.value.phone.trim()) {
    show('Пожалуйста, заполните все обязательные поля', { 
      title: 'Заполните все поля', 
      type: 'warning', 
      duration: 3000 
    })
    return
  }

  if (!form.value.program) {
    show('Пожалуйста, выберите интересующую программу', { 
      title: 'Выберите программу', 
      type: 'warning', 
      duration: 3000 
    })
    return
  }

  isSubmitting.value = true
  
  try {
    // Подготавливаем данные в формате API
    const nameParts = form.value.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    const sanitizePhone = (value: string) => value.replace(/[^+\d]/g, '')
    const applicationData = {
      personal_info: {
        first_name: firstName,
        last_name: lastName,
        email: form.value.email,
        phone: sanitizePhone(form.value.phone)
      },
      education: {
        level: form.value.level,
        field: form.value.program || 'Не указано'
      },
      preferences: {
        universities: [props.university.name],
        programs: form.value.program ? [form.value.program] : [],
        budget: 'Не указан',
        start_date: new Date().getFullYear().toString()
      },
      additional_info: form.value.comment || '',
      source: 'university_detail'
    }
    
    // Отправляем данные на сервер
    const response = await $fetch('/api/v1/applications', {
      method: 'POST',
      body: applicationData
    })
    
    console.log('Application submitted successfully:', response)
    
    // Проверяем результат интеграции с Bitrix
    if (response.bitrix?.leadId) {
      console.log(`Bitrix lead created with ID: ${response.bitrix.leadId}`)
    } else if (response.bitrix?.error) {
      console.warn('Bitrix integration error:', response.bitrix.error)
    }
    
    // Reset form
    form.value = {
      name: '',
      phone: '',
      email: '',
      program: '',
      level: 'bachelor',
      comment: '',
      privacyAgreed: false
    }
    
    // Показать сообщение об успехе
    show('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', { 
      title: 'Заявка отправлена', 
      type: 'success', 
      duration: 5000 
    })
    
  } catch (error: any) {
    console.error('Error submitting application:', error)
    
    // Показать сообщение об ошибке с учетом ошибок валидации сервера
    const serverErrors = Array.isArray(error?.data?.errors) ? error.data.errors : null
    if (serverErrors && serverErrors.length) {
      show(serverErrors.join('\n'), { 
        title: 'Ошибка валидации', 
        type: 'error', 
        duration: 7000 
      })
    } else {
      show('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.', { 
        title: 'Ошибка отправки', 
        type: 'error', 
        duration: 5000 
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
