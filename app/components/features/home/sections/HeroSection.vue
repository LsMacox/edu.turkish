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
    <div class="container mx-auto max-w-7xl container-padding relative z-10">
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
          <BaseCard
            ref="heroMediaRef"
            padding="lg"
            shadow="md"
            rounded="xl"
            class="relative overflow-hidden"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <NuxtImg
              :src="ASSETS.home.heroStudents"
              alt="Group of happy international students"
              class="w-full h-hero-image object-cover rounded-responsive"
              fetchpriority="high"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
            <video
              v-if="shouldLoadVideo && !videoError"
              ref="videoRef"
              class="absolute inset-0 w-full h-full object-cover rounded-responsive transition-opacity duration-700"
              :class="[isVideoLoaded ? 'opacity-100' : 'opacity-0']"
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
              @error="handleVideoError"
              @canplay="handleVideoLoaded"
            >
              <source :src="getCdnUrl(ASSETS.home.heroVideo)" type="video/mp4" />
            </video>
          </BaseCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseCard from '~/components/shared/BaseCard.vue'
import { ASSETS } from '~~/lib/config/assets'
import { namespace, key } from '~~/lib/i18n'

// Hero section
const heroNs = namespace('home.hero')

const modal = useApplicationModal()
const { t } = useI18n()
const { getCdnUrl } = useCdn()

const heroMediaRef = useTemplateRef<typeof BaseCard>('heroMediaRef')
const videoRef = ref<HTMLVideoElement | null>(null)
const shouldLoadVideo = ref(false)
const videoError = ref(false)
const isVideoLoaded = ref(false)

let observer: IntersectionObserver | null = null

const getHeroElement = () => heroMediaRef.value?.rootElement?.value ?? null

onMounted(() => {
  const heroElement = getHeroElement()
  if (heroElement && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          shouldLoadVideo.value = true
          const element = getHeroElement()
          if (element && observer) {
            observer.unobserve(element)
          }
          observer = null
          break
        }
      }
    })

    observer.observe(heroElement)
  } else {
    shouldLoadVideo.value = true
  }
})

onBeforeUnmount(() => {
  const element = getHeroElement()
  if (element && observer) {
    observer.unobserve(element)
  }
  observer = null
})

const handleMouseEnter = () => {
  if (videoRef.value) {
    videoRef.value.muted = false
  }
}

const handleMouseLeave = () => {
  if (videoRef.value) {
    videoRef.value.muted = true
  }
}

const handleVideoError = () => {
  videoError.value = true
  if (videoRef.value) {
    videoRef.value.pause()
  }
}

const handleVideoLoaded = () => {
  isVideoLoaded.value = true
}
</script>
