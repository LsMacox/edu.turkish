<template>
  <div class="power-page bg-white">
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center text-center overflow-hidden bg-slate-900 text-white">
      <!-- Background Image -->
      <div v-if="heroImage" class="absolute inset-0 z-0">
        <NuxtImg
          :src="heroImage"
          :alt="article.heroImageAlt || article.title"
          class="w-full h-full object-cover opacity-30"
          format="webp"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
      </div>

      <!-- Content -->
      <div class="container relative z-10 px-4 py-12 md:py-20">
        <span v-if="article.category" class="inline-block px-4 py-1 mb-4 md:mb-6 text-xs md:text-sm font-bold tracking-wider uppercase bg-primary text-white rounded-full">
          {{ article.category.label }}
        </span>
        <h1 class="max-w-4xl mx-auto text-3xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl mb-6 md:mb-8">
          {{ article.title }}
        </h1>
        <p v-if="article.excerpt" class="max-w-2xl mx-auto text-base md:text-2xl text-gray-200 leading-relaxed mb-8 md:mb-10">
          {{ article.excerpt }}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            class="w-full sm:w-auto px-8 py-4 text-base md:text-lg font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50 min-w-[200px]"
            @click="scrollToConsultation"
          >
            {{ t('power_page.cta.consult') }}
          </button>
          <NuxtLink 
            :to="localePath('/universities')"
            class="w-full sm:w-auto px-8 py-4 text-base md:text-lg font-bold text-white border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all min-w-[200px]"
          >
            {{ t('power_page.cta.universities') }}
          </NuxtLink>
        </div>

        <!-- Trust Badges / Stats -->
        <div v-if="article.quickFacts?.length" class="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto border-t border-white/10 pt-8">
          <div v-for="fact in article.quickFacts" :key="fact.title" class="text-center">
            <div class="text-2xl md:text-3xl font-bold text-primary">{{ fact.value }}</div>
            <div class="text-xs md:text-sm text-gray-400">{{ fact.title }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Flow -->
    <section class="py-12 md:py-20">
      <div class="container px-4 mx-auto max-w-4xl">
        <BlogPowerPageContent :content="article.content" />
      </div>
    </section>

    <!-- Sticky Bottom CTA for Mobile -->
    <StickyCta @click="scrollToConsultation" />
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleDetail } from '~~/server/types/api'
import { useApplicationModalStore } from '~/stores/applicationModal'
import StickyCta from './StickyCta.vue'

const props = defineProps<{
  article: BlogArticleDetail
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const applicationModalStore = useApplicationModalStore()

const heroImage = computed(() => props.article.heroImage || props.article.image)

const scrollToConsultation = () => {
  applicationModalStore.openModal()
}
</script>

