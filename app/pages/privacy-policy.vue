<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto container-padding section-py">
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 class="text-hero mb-4 px-2 sm:px-0">
            {{ t(privacyNs('title')) }}
          </h1>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-button sm:rounded-card shadow-card-hover card-padding-lg">
          <div class="prose max-w-none space-y-6 sm:space-y-8">
            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(privacyNs('data_collection_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-body leading-relaxed sm:leading-loose">
                {{ t(privacyNs('data_collection')) }}
              </p>
            </section>

            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(privacyNs('data_usage_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-body leading-relaxed sm:leading-loose">
                {{ t(privacyNs('data_usage')) }}
              </p>
            </section>

            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(privacyNs('contact_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-body leading-relaxed sm:leading-loose">
                {{ t(privacyNs('contact')) }}
              </p>
            </section>
          </div>
        </div>

        <!-- Mobile-friendly Navigation/Action Area -->
        <div class="mt-8 sm:mt-10 lg:mt-12 text-center">
          <!-- Back to Home Button -->
          <NuxtLink
            :to="localePath('/')"
            class="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-button font-semibold hover:bg-red-600 transition-colors shadow-card-hover text-sm sm:text-base min-h-touch-48"
          >
            <Icon name="mdi:arrow-left" class="mr-2" />
            {{ t(key('back_to_home')) }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace, key } from '~~/lib/i18n'

const privacyNs = namespace('privacy')
const { t } = useI18n()
const localePath = useLocalePath()

// SEO Meta Tags
useHead({
  title: () => t(privacyNs('title')),
  meta: [
    {
      name: 'description',
      content: () => t(privacyNs('title')),
    },
    {
      property: 'og:title',
      content: () => t(privacyNs('title')),
    },
    {
      property: 'og:description',
      content: () => t(privacyNs('title')),
    },
  ],
})
</script>
