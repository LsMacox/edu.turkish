<template>
  <section class="relative bg-gradient-to-br from-blue-50 to-purple-50 section-py-lg h-[500px]">
    <img
      :src="cdnUrl('17a859b6-2e09-4e15-9dd8-b40c50a7bbd6.png')"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-center opacity-30"
      loading="eager"
      aria-hidden="true"
    />
    <div class="relative container mx-auto container-padding-narrow h-full flex items-center">
      <div class="max-w-4xl">
        <div class="space-y-6">
          <h1 class="text-hero">
            {{ t('about.hero.title') }}
          </h1>
          <p class="text-hero-subtitle max-w-3xl">
            {{ t('about.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center space-x-2">
              <Icon name="mdi:account-group" class="text-primary" />
              <span class="text-secondary font-medium">{{ t('about.hero.experienced_team') }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary font-medium">{{
                t('about.hero.students_enrolled')
              }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:shield-check" class="text-blue-500" />
              <span class="text-secondary font-medium">{{
                t('about.hero.official_contracts')
              }}</span>
            </div>
          </div>
          <div class="pt-4">
            <BaseButton
              size="lg"
              icon="mdi:arrow-right"
              icon-position="right"
              @click="handleCtaClick"
            >
              {{ t('about.hero.cta') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { cdnUrl } = useCdn()
const applicationModalStore = useApplicationModalStore()

const handleCtaClick = () => {
  applicationModalStore.openModal({
    source: 'about_hero',
    description: 'About Page Hero CTA',
  })
}
</script>
