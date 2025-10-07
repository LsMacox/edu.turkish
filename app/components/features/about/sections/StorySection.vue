<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <BaseSectionHeader
          :title="$t('about.story.title')"
          :subtitle="$t('about.story.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              class="w-full h-80 object-cover rounded-2xl shadow-custom"
              src="/images/our-story.png"
              :alt="$t('about.story.imageAlt')"
            />
          </div>
          <div class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <span class="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ $t('about.story.timeline.step1.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.story.timeline.step1.description') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <span class="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ $t('about.story.timeline.step2.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.story.timeline.step2.description') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <span class="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ $t('about.story.timeline.step3.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.story.timeline.step3.description') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <span class="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ $t('about.story.timeline.step4.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.story.timeline.step4.description') }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl card-padding shadow-custom">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-xl md:text-2xl font-bold text-primary">500+</p>
                  <p class="text-sm text-gray-600">{{ $t('about.story.stats.students') }}</p>
                </div>
                <div>
                  <p class="text-xl md:text-2xl font-bold text-primary">20+</p>
                  <p class="text-sm text-gray-600">{{ $t('about.story.stats.universities') }}</p>
                </div>
                <div>
                  <p class="text-xl md:text-2xl font-bold text-primary">98%</p>
                  <p class="text-sm text-gray-600">{{ $t('about.story.stats.success') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
