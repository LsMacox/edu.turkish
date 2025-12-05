export const useReferral = () => {
  const referralCode = ref<string>('')

  onMounted(() => {
    const cookies = document.cookie.split('; ').map((row) => {
      const [key, ...valueParts] = row.split('=')
      return [key, valueParts.join('=')] as const
    })
    const cookieMap = new Map(cookies)

    const codeFromCookie = cookieMap.get('referral_code') || ''

    if (codeFromCookie) {
      referralCode.value = codeFromCookie
    }
  })

  const setReferralCode = (code: string) => {
    referralCode.value = code
  }

  return {
    referralCode: computed(() => referralCode.value),
    setReferralCode,
  }
}
