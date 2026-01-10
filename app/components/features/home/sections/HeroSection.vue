<template>
  <section id="hero" class="relative overflow-hidden hero-py">
    <div class="absolute inset-0">
      <NuxtImg
        :src="ASSETS.home.heroBackground"
        alt=""
        class="w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
        sizes="100vw"
        format="webp"
      />
      <div class="absolute inset-0 bg-white/90" />
    </div>
    <div class="container mx-auto max-w-7xl container-padding relative z-20">
      <div class="grid lg:grid-cols-2 gap-section-lg items-center">
        <div class="space-y-section-sm order-2 lg:order-1">
          <div class="space-component-md">
            <h1 class="text-hero">
              <span class="block xs:inline">{{ t(heroNs('title')) }}</span>
              <span class="text-primary ml-2 xs:ml-3">{{ t(heroNs('title_accent')) }}</span>
            </h1>
            <p class="text-hero-subtitle">
              {{ t(heroNs('subtitle')) }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-component-md pt-component-xs">
            <BaseIconText
              icon="mdi:check-circle"
              :text="t(heroNs('stat_students'))"
              size="sm"
              color="secondary"
              icon-color="success"
              spacing="sm"
              weight="medium"
            />
            <BaseIconText
              icon="mdi:shield-check"
              :text="t(heroNs('stat_verified'))"
              size="sm"
              color="secondary"
              icon-color="info"
              spacing="sm"
              weight="medium"
            />
            <BaseIconText
              icon="mdi:file-document"
              :text="t(heroNs('stat_documents'))"
              size="sm"
              color="secondary"
              icon-color="info"
              spacing="sm"
              weight="medium"
              class="[&>svg]:text-purple-500"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-component-md pt-component-md">
            <BaseButton variant="primary" size="lg" class="shadow-card w-full sm:w-auto" @click="modal.openModal({ source: 'home_hero_cta', description: t(key('cta.consultation')) })">
              {{ t(key('cta.consultation')) }}
            </BaseButton>
          </div>
        </div>

        <div class="relative order-1 lg:order-2">
          <div class="relative rounded-xl overflow-hidden shadow-lg">
            <BunnyVideoPlayer
              :video-id="ASSETS.home.heroVideoId"
              :library-id="bunnyLibraryId"
              aspect-ratio="4/3"
              rounded="none"
              :controls="false"
              :autoplay="true"
              :muted="true"
              :loop="true"
              :deferred="true"
              background-class="bg-transparent"
              title="Student video"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace, key } from '~~/lib/i18n'

const heroNs = namespace('home.hero')

const modal = useApplicationModal()
const { t } = useI18n()

const bunnyLibraryId = parseInt(useRuntimeConfig().public.bunnyLibraryId)
</script>
