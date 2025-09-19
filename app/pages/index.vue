<template>
  <div>
    <HomeHeroSection />
    <WhoSection />
    <HowSection />
    <UniversitiesSection />
    <ServicesSection />
    <ReviewsSection />
    <FearsSection />
    <BlogSection />
    <FinalCtaSection :deadline="applicationDeadline" />
  </div>
</template>

<script setup lang="ts">
// Настраиваемая дата дедлайна для обратного счетчика
// Можно изменить эту дату в зависимости от текущих дедлайнов университетов
const applicationDeadline = '2025-11-01T23:59:59'

useHead({
  title: 'Главная',
  meta: [
    { name: 'description', content: 'Обучение в Турции: поступление в университеты, программы и поддержка.' }
  ]
})

// Ensure universities are fetched on the home page reload (limit to 6)
const universitiesStore = useUniversitiesStore()

if (import.meta.server) {
  await universitiesStore.initAndFetchSSR({ limit: 6 })
}

onMounted(async () => {
  if (!universitiesStore.universities.length) {
    await universitiesStore.fetchUniversities({ limit: 6 })
  }
})
</script>
