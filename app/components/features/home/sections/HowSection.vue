<template>
  <section id="how-it-works" v-scroll-reveal class="section-py bg-background">
    <div class="container">
      <BaseSectionHeader
        :title="t(howNs('title'))"
        :subtitle="t(howNs('subtitle'))"
        align="center"
        margin-bottom="lg"
      />
      <div class="relative grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div class="pointer-events-none absolute top-16 left-0 right-0 hidden lg:block">
          <div class="mx-16 border-t border-dashed border-gray-200" />
        </div>

        <div
          v-scroll-reveal
          class="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300"
        >
          <div class="flex flex-col items-center space-y-3">
            <div
              class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-xl"
            >
              1
            </div>
            <div
              class="w-16 h-16 rounded-full border border-blue-100 bg-blue-50 grid place-items-center mx-auto group-hover:bg-blue-100 transition-colors"
            >
              <Icon name="mdi:magnify" class="text-blue-600 text-2xl" />
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t(howNs('step1_title')) }}</h3>
            <p class="text-card-body">{{ t(howNs('step1_desc')) }}</p>
          </div>
        </div>

        <div
          class="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300"
        >
          <div class="flex flex-col items-center space-y-3">
            <div
              class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-xl"
            >
              2
            </div>
            <div
              class="w-16 h-16 rounded-full border border-green-100 bg-green-50 grid place-items-center mx-auto group-hover:bg-green-100 transition-colors"
            >
              <Icon name="mdi:pencil" class="text-green-600 text-2xl" />
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t(howNs('step2_title')) }}</h3>
            <p class="text-card-body">{{ t(howNs('step2_desc')) }}</p>
          </div>
        </div>

        <div
          class="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300"
        >
          <div class="flex flex-col items-center space-y-3">
            <div
              class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-xl"
            >
              3
            </div>
            <div
              class="w-16 h-16 rounded-full border border-purple-100 bg-purple-50 grid place-items-center mx-auto group-hover:bg-purple-100 transition-colors"
            >
              <Icon name="mdi:email" class="text-purple-600 text-2xl" />
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t(howNs('step3_title')) }}</h3>
            <p class="text-card-body">{{ t(howNs('step3_desc')) }}</p>
          </div>
        </div>

        <div
          class="flex flex-col items-center text-center space-y-4 group hover:scale-105 transition-transform duration-300"
        >
          <div class="flex flex-col items-center space-y-3">
            <div
              class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-xl"
            >
              4
            </div>
            <div
              class="w-16 h-16 rounded-full border border-orange-100 bg-orange-50 grid place-items-center mx-auto group-hover:bg-orange-100 transition-colors"
            >
              <Icon name="mdi:airplane" class="text-orange-600 text-2xl" />
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t(howNs('step4_title')) }}</h3>
            <p class="text-card-body">{{ t(howNs('step4_desc')) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

// How it works steps
const howNs = namespace('home.how')
const { t } = useI18n()
</script>
