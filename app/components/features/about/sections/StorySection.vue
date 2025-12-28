<template>
  <BaseSection padding="lg" max-width="6xl">
        <BaseSectionHeader
          :title="t(storyNs('title'))"
          :subtitle="t(storyNs('subtitle'))"
          align="center"
          max-width="full"
        />

        <BaseGrid :lg="2" gap="lg" align="center">
          <div>
            <NuxtImg
              class="w-full h-80 object-cover rounded-card shadow-elevated"
              :src="ASSETS.about.storyImage"
              :alt="t(storyNs('imageAlt'))"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
          </div>
          <div class="space-component-md">
            <div class="space-component-md">
              <BaseTimelineStep
                v-for="step in steps"
                :key="step"
                :step="step"
                :title="t(STEP_TITLE_KEYS[step])"
                :description="t(STEP_DESC_KEYS[step])"
              />
            </div>

            <BaseStatsCard
              :stats="[
                { value: '500+', label: t(statsNs('students')) },
                { value: '20+', label: t(statsNs('universities')) },
                { value: '98%', label: t(statsNs('success')) },
              ]"
            />
            <div class="text-center">
              <NuxtLink
                :to="localePath('ReviewsPage')"
                class="text-primary font-medium hover:text-primary/80 transition-color inline-flex items-center"
              >
                {{ t(storyNs('read_reviews')) }}
                <Icon name="mdi:arrow-right" class="ml-1" />
              </NuxtLink>
            </div>
          </div>
        </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const storyNs = namespace('about.story')
const timelineNs = namespace('about.story.timeline')
const statsNs = namespace('about.story.stats')
const { t } = useI18n()
const localePath = useLocalePath()

type StepId = 1 | 2 | 3 | 4
const steps: StepId[] = [1, 2, 3, 4]

const STEP_TITLE_KEYS: Record<StepId, ReturnType<typeof timelineNs>> = {
  1: timelineNs('step1.title'),
  2: timelineNs('step2.title'),
  3: timelineNs('step3.title'),
  4: timelineNs('step4.title'),
}

const STEP_DESC_KEYS: Record<StepId, ReturnType<typeof timelineNs>> = {
  1: timelineNs('step1.description'),
  2: timelineNs('step2.description'),
  3: timelineNs('step3.description'),
  4: timelineNs('step4.description'),
}
</script>
