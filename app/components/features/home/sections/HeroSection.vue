<template>
  <section id="hero" class="relative overflow-hidden pt-3 pb-10 md:py-20">
    <div class="absolute inset-0">
      <NuxtImg
        :src="cdnUrl('d837748f-0c70-4c7f-a6af-771cd41e8cfb.jpg')"
        alt=""
        class="w-full h-full object-cover"
        decoding="async"
        sizes="100vw"
        format="webp"
      />
      <div class="absolute inset-0 bg-white/90" />
    </div>
    <div class="container mx-auto max-w-7xl container-padding relative z-10">
      <div class="grid lg:grid-cols-2 gap-section-lg items-center">
        <div class="space-y-section-sm order-2 lg:order-1">
          <div class="space-y-3 md:space-y-4">
            <h1 class="text-hero text-xl xs:text-2xl md:text-3xl lg:text-4xl leading-tight lg:leading-tight">
              <span class="block xs:inline">{{ t('home.hero.title') }}</span>
              <span class="text-primary ml-2 xs:ml-3">{{ t('home.hero.title_accent') }}</span>
            </h1>
            <p class="text-hero-subtitle">
              {{ t('home.hero.subtitle') }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-3">
            <div class="flex items-center space-x-1.5">
              <Icon name="mdi:check-circle" class="text-green-500 text-lg md:text-xl" />
              <span class="text-secondary font-medium text-sm md:text-base">{{
                t('home.hero.stat_students')
              }}</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <Icon name="mdi:shield-check" class="text-blue-500 text-lg md:text-xl" />
              <span class="text-secondary font-medium text-sm md:text-base">{{
                t('home.hero.stat_verified')
              }}</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <Icon name="mdi:file-document" class="text-purple-500 text-lg md:text-xl" />
              <span class="text-secondary font-medium text-sm md:text-base">{{
                t('home.hero.stat_documents')
              }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
            <button
              class="inline-flex items-center justify-center bg-primary text-white px-4 md:px-8 py-3 md:py-4 rounded-xl hover:bg-red-600 transition-all shadow-lg text-btn-lg"
              @click="modal.openModal()"
            >
              {{ t('cta.consultation') }}
            </button>
            <p class="text-xs md:text-sm text-gray-500 max-w-xs">
              {{ t('cta.apply_note') }}
            </p>
          </div>
        </div>

        <div class="relative order-1 lg:order-2">
          <div
            ref="heroMediaRef"
            class="bg-white rounded-2xl md:rounded-3xl shadow-custom card-padding relative overflow-hidden"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <NuxtImg
              :src="cdnUrl('8ec3658d-c21c-4843-bacf-f5ae1f830173.png')"
              alt="Group of happy international students"
              class="w-full h-64 xs:h-72 md:h-80 object-cover rounded-xl md:rounded-2xl"
              fetchpriority="high"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
            <video
              v-if="shouldLoadVideo && !videoError"
              ref="videoRef"
              class="absolute inset-0 w-full h-full object-cover rounded-xl md:rounded-2xl"
              :poster="cdnUrl('8ec3658d-c21c-4843-bacf-f5ae1f830173.png')"
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
              @error="handleVideoError"
            >
              <source :src="cdnUrl('88212a29-9f40-4c01-89d0-7a522c61b8c5.mp4')" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

// Hero section
const modal = useApplicationModalStore()
const { t } = useI18n()
const { cdnUrl } = useCdn()

 const heroMediaRef = ref<HTMLElement | null>(null)
 const videoRef = ref<HTMLVideoElement | null>(null)
 const shouldLoadVideo = ref(false)
 const videoError = ref(false)

 let observer: IntersectionObserver | null = null

 onMounted(() => {
   if (heroMediaRef.value && 'IntersectionObserver' in window) {
     observer = new IntersectionObserver((entries) => {
       for (const entry of entries) {
         if (entry.isIntersecting) {
           shouldLoadVideo.value = true
           if (heroMediaRef.value && observer) {
             observer.unobserve(heroMediaRef.value)
           }
           observer = null
           break
         }
       }
     })

     observer.observe(heroMediaRef.value)
   } else {
     shouldLoadVideo.value = true
   }
 })

 onBeforeUnmount(() => {
   if (heroMediaRef.value && observer) {
     observer.unobserve(heroMediaRef.value)
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

// no manual preload to avoid mismatch with Nuxt Image/IPX
</script>
