<template>
  <BaseSection padding="lg" max-width="4xl">
    <BaseSectionHeader
      :title="t(ns('title'))"
      align="center"
      margin-bottom="lg"
    />

    <div class="space-component-xl">
      <BaseCard padding="xl" shadow="md" rounded="2xl">
        <h3 class="text-section-title mb-component-sm">
          {{ t(ns('history')) }}
        </h3>
        <p class="text-card-body">
          {{ university.about.history }}
        </p>
      </BaseCard>

      <BaseCard padding="xl" shadow="md" rounded="2xl">
        <h3 class="text-section-title mb-component-sm">
          {{ t(ns('campus')) }}
        </h3>
        <p class="text-card-body">
          {{ university.about.mission }}
        </p>
      </BaseCard>

      <BaseCard
        v-if="university.about.advantages?.length"
        padding="xl"
        shadow="md"
        rounded="2xl"
      >
        <h3 class="text-section-title mb-component-sm">
          {{ t(ns('advantages')) }}
        </h3>
        <BaseGrid :md="2" gap="lg">
          <div
            v-for="(advantage, index) in university.about.advantages"
            :key="index"
            class="flex items-start gap-component-sm"
          >
            <BaseStatusBadge icon="ph:check" color="success" size="sm" class="mt-1" />
            <div>
              <h5 class="font-semibold text-secondary">{{ advantage.title }}</h5>
              <p class="text-body-sm">{{ advantage.description }}</p>
            </div>
          </div>
        </BaseGrid>
      </BaseCard>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { namespace } from '~~/lib/i18n'

const ns = namespace('universities.detail.aboutUniversity')
const { t } = useI18n()

defineProps<{
  university: UniversityDetail
}>()
</script>
