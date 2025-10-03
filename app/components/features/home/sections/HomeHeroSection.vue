<template>
  <section id="hero" class="relative bg-gradient-to-br from-blue-50 to-purple-50 section-py-lg">
    <div class="container mx-auto max-w-7xl container-padding">
      <div class="grid lg:grid-cols-2 gap-section-lg items-center">
        <div class="space-y-section-sm order-2 lg:order-1">
          <div class="space-y-3 md:space-y-4">
            <h1 class="text-hero">
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

          <div class="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button
              class="bg-primary text-white px-4 md:px-8 py-3 md:py-4 rounded-xl hover:bg-red-600 transition-all shadow-lg text-btn-lg"
              @click="modal.openModal()"
            >
              {{ t('cta.apply') }}
            </button>
            <div class="flex items-center gap-2 md:gap-3">
              <a
                :href="channels?.whatsapp?.href"
                target="_blank"
                class="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:bg-green-600 hover:scale-105 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <Icon name="mdi:whatsapp" class="text-base md:text-lg" />
              </a>
              <a
                :href="channels?.telegramBot?.href"
                target="_blank"
                class="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200"
                aria-label="Telegram"
              >
                <Icon name="mdi:telegram" class="text-base md:text-lg" />
              </a>
              <a
                :href="instagramChannel.href"
                target="_blank"
                class="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:bg-pink-600 hover:scale-105 transition-all duration-200"
                aria-label="Instagram"
              >
                <Icon name="mdi:instagram" class="text-base md:text-lg" />
              </a>
            </div>
          </div>
        </div>

        <div class="relative order-1 lg:order-2">
          <div class="bg-white rounded-2xl md:rounded-3xl shadow-custom card-padding">
            <NuxtImg
              src="/images/main-hero.png"
              alt="Group of happy international students"
              class="w-full h-64 xs:h-72 md:h-80 object-cover rounded-xl md:rounded-2xl"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 864px"
              :widths="[480, 640, 768, 864, 1024]"
              :preload="true"
              fetchpriority="high"
              decoding="async"
              :placeholder="true"
              :quality="78"
              format="webp"
            />
          </div>
          <!-- Success rate badge - positioned differently on mobile vs desktop -->
          <div
            class="lg:absolute lg:-top-4 lg:-right-4 mt-4 lg:mt-0 bg-white rounded-xl shadow-custom p-3 md:p-4 max-w-xs lg:animate-bounce"
          >
            <div class="flex items-center gap-2 md:gap-3">
              <div
                class="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Icon name="mdi:star" class="text-green-600 text-base md:text-lg" />
              </div>
              <div>
                <p class="text-body-sm font-semibold text-secondary">
                  {{ t('home.hero.success_rate') }}
                </p>
                <p class="text-body-sm text-gray-500">{{ t('home.hero.success_desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContactChannels } from '~/composables/useContactChannels'
import { useApplicationModalStore } from '~/stores/applicationModal'

// Hero section
const modal = useApplicationModalStore()
const { channels, getChannel } = useContactChannels()
const instagramChannel = getChannel('instagram')
const { t } = useI18n()

// no manual preload to avoid mismatch with Nuxt Image/IPX
</script>
