export const useReferral = () => {
  const referralCode = ref<string>('')

  // Get referral code from cookies on client side
  onMounted(() => {
    const cookies = document.cookie.split('; ').find((row) => row.startsWith('ref='))

    if (cookies) {
      referralCode.value = cookies.split('=')[1] || ''
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
