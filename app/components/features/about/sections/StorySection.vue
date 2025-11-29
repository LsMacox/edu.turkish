<template>
  <section class="section-py-lg">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ $t('about.story.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ $t('about.story.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <NuxtImg
              class="w-full h-80 object-cover rounded-2xl shadow-custom"
              src="0683f4da-e558-4c40-a747-a24f0fdbc535.png"
              :alt="$t('about.story.imageAlt')"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
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
            <div class="text-center">
              <NuxtLink
                :to="localePath('ReviewsPage')"
                class="text-primary font-medium hover:text-red-700 transition-colors inline-flex items-center"
              >
                {{ $t('about.story.read_reviews') }}
                <Icon name="mdi:arrow-right" class="ml-1" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
