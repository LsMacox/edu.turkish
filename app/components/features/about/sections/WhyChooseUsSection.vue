<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ $t('about.whyChooseUs.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ $t('about.whyChooseUs.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <BaseIconBadge
                icon="mdi:school"
                color="blue"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-2">
                  {{ $t('about.whyChooseUs.advantages.personal.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.personal.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <BaseIconBadge
                icon="mdi:handshake"
                color="green"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-2">
                  {{ $t('about.whyChooseUs.advantages.direct.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.direct.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <BaseIconBadge
                icon="mdi:translate"
                color="purple"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-2">
                  {{ $t('about.whyChooseUs.advantages.multilingual.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.multilingual.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <BaseIconBadge
                icon="mdi:hand-heart"
                color="orange"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-2">
                  {{ $t('about.whyChooseUs.advantages.support.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.support.description') }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <img
              class="w-full h-96 object-cover rounded-2xl shadow-custom"
              :src="cdnUrl('23fe23b3-7b1b-4241-8c01-da4fa809a81a.jpg')"
              :alt="$t('about.whyChooseUs.imageAlt')"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { cdnUrl } = useCdn()
</script>
