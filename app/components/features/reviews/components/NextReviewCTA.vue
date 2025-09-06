<template>
  <section id="next-review-cta" class="pt-12 pb-16 md:py-20 bg-gradient-to-r from-primary to-red-600">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-4xl mx-auto text-center text-white">
        <div class="mb-8">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6">
            {{ $t('reviews.nextReviewCTA.title') }} <span class="text-red-100">{{ $t('reviews.nextReviewCTA.titleAccent') }}</span>
          </h2>
          <p class="text-xl text-red-100 leading-relaxed max-w-3xl mx-auto">
            {{ $t('reviews.nextReviewCTA.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <!-- Step 1 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t('reviews.nextReviewCTA.steps.consultation.title') }}</h3>
            <p class="text-red-100 text-sm">
              {{ $t('reviews.nextReviewCTA.steps.consultation.description') }}
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t('reviews.nextReviewCTA.steps.plan.title') }}</h3>
            <p class="text-red-100 text-sm">
              {{ $t('reviews.nextReviewCTA.steps.plan.description') }}
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 class="text-lg font-bold mb-2">{{ $t('reviews.nextReviewCTA.steps.admission.title') }}</h3>
            <p class="text-red-100 text-sm">
              {{ $t('reviews.nextReviewCTA.steps.admission.description') }}
            </p>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur rounded-3xl p-8 mb-8">
          <div class="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div class="text-3xl font-bold mb-1">500+</div>
              <p class="text-red-100 text-sm">{{ $t('reviews.nextReviewCTA.stats.students') }}</p>
            </div>
            <div>
              <div class="text-3xl font-bold mb-1">98%</div>
              <p class="text-red-100 text-sm">{{ $t('reviews.nextReviewCTA.stats.admissions') }}</p>
            </div>
            <div>
              <div class="text-3xl font-bold mb-1">20+</div>
              <p class="text-red-100 text-sm">{{ $t('reviews.nextReviewCTA.stats.universities') }}</p>
            </div>
            <div>
              <div class="text-3xl font-bold mb-1">6</div>
              <p class="text-red-100 text-sm">{{ $t('reviews.nextReviewCTA.stats.experience') }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="modal.openModal()" 
            class="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center space-x-2"
          >
            <Icon name="mdi:rocket-launch" class="text-xl" />
            <span>{{ $t('reviews.nextReviewCTA.cta.button') }}</span>
          </button>
          
          <div class="flex items-center space-x-2 text-red-100">
            <Icon name="mdi:phone" class="text-lg" />
            <span class="font-semibold">+7 (700) 123-45-67</span>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-center space-x-6 text-red-100">
          <div class="flex items-center space-x-2">
            <Icon name="mdi:check-circle" class="text-green-300" />
            <span class="text-sm">{{ $t('reviews.nextReviewCTA.features.consultation') }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="mdi:check-circle" class="text-green-300" />
            <span class="text-sm">{{ $t('reviews.nextReviewCTA.features.noHiddenFees') }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="mdi:check-circle" class="text-green-300" />
            <span class="text-sm">{{ $t('reviews.nextReviewCTA.features.guarantee') }}</span>
          </div>
        </div>

        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()
</script>
