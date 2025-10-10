export default defineNuxtPlugin((nuxtApp) => {
  const isPageLoading = useState('ui.pageLoading', () => false)

  const stopLoading = () => {
    isPageLoading.value = false
  }

  nuxtApp.hook('page:start', () => {
    isPageLoading.value = true
  })

  nuxtApp.hook('page:finish', stopLoading)
  nuxtApp.hook('app:error', stopLoading)
  nuxtApp.hook('page:transition:finish', stopLoading)
})
