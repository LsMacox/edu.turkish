export const sanitizePhone = (value: string) => value.replace(/[^+\d]/g, '')

export const useInternationalPhone = (phone: Ref<string>) => {
  const formatInternationalPhone = (raw: string) => {
    const input = sanitizePhone(raw)
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

  const onPhoneInput = (event: Event) => {
    const target = event.target as HTMLInputElement | null
    if (!target) return
    phone.value = formatInternationalPhone(target.value)
  }

  const onPhoneKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Backspace') return
    const target = event.target as HTMLInputElement | null
    if (!target) return
    const start = target.selectionStart ?? 0
    const end = target.selectionEnd ?? 0
    const value = target.value
    if (start !== end || start === 0) return
    const leftChar = value[start - 1] || ''
    if (/\d/.test(leftChar)) return

    event.preventDefault()
    const digits = value.replace(/\D/g, '')
    const newDigits = digits.slice(0, -1)
    const newRaw = newDigits.length ? '+' + newDigits : ''
    phone.value = formatInternationalPhone(newRaw)
  }

  return {
    formatInternationalPhone,
    sanitizePhone,
    onPhoneInput,
    onPhoneKeydown,
  }
}
