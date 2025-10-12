<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize currency store from localStorage on app mount
const currencyStore = useCurrencyStore()

onMounted(() => {
  currencyStore.initCurrency()
})
</script>
