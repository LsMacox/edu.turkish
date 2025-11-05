<template>
  <section class="section-py-lg">
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

        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl card-padding-lg lg:p-12 text-white"
        >
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-section-title mb-4 text-white">
                {{ $t('about.whyChooseUs.database.title') }}
              </h3>
              <p class="text-lg leading-relaxed mb-6">
                {{ $t('about.whyChooseUs.database.description') }}
              </p>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.universities') }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.programs') }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.scholarships') }}</span>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div
                class="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon name="mdi:database" class="text-blue-600 text-4xl" />
              </div>
              <p class="text-sm opacity-90">{{ $t('about.whyChooseUs.database.exclusive') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { cdnUrl } = useCdn()
</script>
