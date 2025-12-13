<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto container-padding section-py">
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 class="text-hero mb-4 px-2 sm:px-0">
            {{ t(contractNs('title')) }}
          </h1>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg card-padding-lg">
          <div class="prose max-w-none space-y-6 sm:space-y-8">
            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(contractNs('services_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose">
                {{ t(contractNs('services')) }}
              </p>
            </section>

            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(contractNs('payment_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose">
                {{ t(contractNs('payment')) }}
              </p>
            </section>

            <section class="mb-6 sm:mb-8">
              <h2
                class="text-lg sm:text-xl md:text-2xl font-semibold text-secondary mt-0 mb-3 sm:mb-4"
              >
                {{ t(contractNs('contact_title')) }}
              </h2>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose">
                {{ t(contractNs('contact')) }}
              </p>
            </section>
          </div>
        </div>

        <!-- Mobile-friendly Navigation/Action Area -->
        <div class="mt-8 sm:mt-10 lg:mt-12 text-center">
          <!-- Back to Home Button -->
          <NuxtLink
            :to="localePath('/')"
            class="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg text-sm sm:text-base min-h-touch-48"
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

const contractNs = namespace('contract')
const { t } = useI18n()
const localePath = useLocalePath()

// SEO Meta Tags
useHead({
  title: () => t(contractNs('title')),
  meta: [
    {
      name: 'description',
      content: () => t(contractNs('title')),
    },
    {
      property: 'og:title',
      content: () => t(contractNs('title')),
    },
    {
      property: 'og:description',
      content: () => t(contractNs('title')),
    },
  ],
})
</script>
