<template>
  <BaseSection padding="lg" max-width="6xl">
        <BaseSectionHeader
          :title="t(whyNs('title'))"
          :subtitle="t(whyNs('subtitle'))"
          align="center"
          max-width="full"
        />

        <BaseGrid :lg="2" gap="lg" align="center" class="mb-component-lg">
          <div class="space-component-lg">
            <div class="flex items-start gap-component-md">
              <BaseIconBox
                icon="mdi:school"
                color="info"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-component-xs">
                  {{ t(advNs('personal.title')) }}
                </h3>
                <p class="text-body-sm">
                  {{ t(advNs('personal.description')) }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-component-md">
              <BaseIconBox
                icon="mdi:handshake"
                color="success"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-component-xs">
                  {{ t(advNs('direct.title')) }}
                </h3>
                <p class="text-body-sm">
                  {{ t(advNs('direct.description')) }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-component-md">
              <BaseIconBox
                icon="mdi:translate"
                color="secondary"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-component-xs">
                  {{ t(advNs('multilingual.title')) }}
                </h3>
                <p class="text-body-sm">
                  {{ t(advNs('multilingual.description')) }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-component-md">
              <BaseIconBox
                icon="mdi:hand-heart"
                color="warning"
                size="md"
                rounded="xl"
                class="flex-shrink-0"
              />
              <div>
                <h3 class="text-card-title mb-component-xs">
                  {{ t(advNs('support.title')) }}
                </h3>
                <p class="text-body-sm">
                  {{ t(advNs('support.description')) }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <NuxtImg
              class="w-full h-96 object-cover rounded-card shadow-elevated"
              :src="ASSETS.about.whyChooseUsImage"
              :alt="t(whyNs('imageAlt'))"
              loading="lazy"
              format="webp"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const whyNs = namespace('about.whyChooseUs')
const advNs = namespace('about.whyChooseUs.advantages')
const { t } = useI18n()
</script>
