<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ t(whyNs('title')) }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ t(whyNs('subtitle')) }}
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
                  {{ t(advNs('personal.title')) }}
                </h3>
                <p class="text-gray-600">
                  {{ t(advNs('personal.description')) }}
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
                  {{ t(advNs('direct.title')) }}
                </h3>
                <p class="text-gray-600">
                  {{ t(advNs('direct.description')) }}
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
                  {{ t(advNs('multilingual.title')) }}
                </h3>
                <p class="text-gray-600">
                  {{ t(advNs('multilingual.description')) }}
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
                  {{ t(advNs('support.title')) }}
                </h3>
                <p class="text-gray-600">
                  {{ t(advNs('support.description')) }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <NuxtImg
              class="w-full h-96 object-cover rounded-2xl shadow-custom"
              :src="ASSETS.about.whyChooseUsImage"
              :alt="t(whyNs('imageAlt'))"
              loading="lazy"
              format="webp"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const whyNs = namespace('about.whyChooseUs')
const advNs = namespace('about.whyChooseUs.advantages')
const { t } = useI18n()
</script>
