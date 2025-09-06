<template>
  <section id="student-stories" class="pt-10 pb-14 md:py-20 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-6">
          {{ $t('reviews.studentStories.title') }} <span class="text-primary">{{ $t('reviews.studentStories.titleAccent') }}</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('reviews.studentStories.description') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white rounded-3xl shadow-custom p-6 md:p-8">
          <div class="mb-6">
            <h3 class="text-xl font-bold text-secondary mb-2">{{ $t('reviews.studentStories.students.aigerim.name') }}</h3>
            <p class="text-primary font-semibold mb-1">Istanbul University</p>
            <p class="text-gray-600">Медицина</p>
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.studentStories.students.aigerim.quote') }}
          </blockquote>
        </div>
      </div>

      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white rounded-3xl shadow-custom p-6 md:p-8">
          <div class="mb-6">
            <h3 class="text-xl font-bold text-secondary mb-2">{{ $t('reviews.studentStories.students.arman.name') }}</h3>
            <p class="text-primary font-semibold mb-1">Middle East Technical University</p>
            <p class="text-gray-600">Инженерия</p>
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.studentStories.students.arman.quote') }}
          </blockquote>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-3xl shadow-custom p-6 md:p-8">
          <div class="mb-6">
            <h3 class="text-xl font-bold text-secondary mb-2">{{ $t('reviews.studentStories.students.dinara.name') }}</h3>
            <p class="text-primary font-semibold mb-1">Boğaziçi University</p>
            <p class="text-gray-600">Бизнес</p>
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.studentStories.students.dinara.quote') }}
          </blockquote>
        </div>
      </div>

      <div class="text-center mt-12 md:mt-16">
        <button 
          @click="modal.openModal()" 
          class="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg"
        >
          {{ $t('reviews.studentStories.ctaButton') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
