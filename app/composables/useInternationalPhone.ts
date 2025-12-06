export const sanitizePhone = (value: string) => value.replace(/[^+\d]/g, '')

export const useInternationalPhone = (phone: Ref<string>) => {
  const formatWithMask = (prefix: string, body: string) => {
    if (!body.length) return prefix
    let res = `${prefix} (${body.slice(0, 3)}`
    if (body.length >= 3) res += ') '
    if (body.length > 3) res += body.slice(3, 6)
    if (body.length >= 6) res += ' ' + body.slice(6, 8)
    if (body.length >= 8) res += '-' + body.slice(8, 10)
    return res.trim()
  }

  const formatInternationalPhone = (raw: string) => {
    const input = sanitizePhone(raw)
    const hasPlus = input.startsWith('+')
    const digits = input.replace(/\D/g, '')
    if (!digits.length) return ''

    const startsWithCode = (code: string) =>
      hasPlus ? input.startsWith(`+${code}`) : digits.startsWith(code)

    if (startsWithCode('7')) return formatWithMask('+7', digits.slice(1, 11))
    if (startsWithCode('90')) return formatWithMask('+90', digits.slice(2, 12))

    const groups = digits.slice(0, 15).match(/\d{1,3}/g) || []
    return '+' + groups.join(' ')
  }

  const onPhoneInput = (e: Event) => {
    const target = e.target as HTMLInputElement | null
    if (target) phone.value = formatInternationalPhone(target.value)
  }

  const onPhoneKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Backspace') return
    const target = e.target as HTMLInputElement | null
    if (!target) return
    const start = target.selectionStart ?? 0
    if (start !== (target.selectionEnd ?? 0) || start === 0) return
    if (/\d/.test(target.value[start - 1] || '')) return
    e.preventDefault()
    const digits = target.value.replace(/\D/g, '')
    phone.value = formatInternationalPhone(digits.slice(0, -1) ? '+' + digits.slice(0, -1) : '')
  }

  return { formatInternationalPhone, sanitizePhone, onPhoneInput, onPhoneKeydown }
}
