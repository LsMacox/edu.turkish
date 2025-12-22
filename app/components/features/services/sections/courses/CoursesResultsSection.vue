<template>
  <div class="mt-component-lg">
    <BaseSectionHeader :title="title" />

    <!-- Max Results style (for TR-YÖS) -->
    <div v-if="maxResults.length > 0" class="mt-component-md grid gap-component-lg md:grid-cols-2">
      <BaseCard
        v-for="(result, index) in maxResults"
        :key="index"
        padding="lg"
        shadow="none"
        rounded="lg"
        bordered
        hover="shadow"
        class="text-center"
      >
        <p class="text-body-lg mb-component-xs">{{ result.package }}</p>
        <p class="text-4xl font-bold text-primary">{{ result.score }}</p>
      </BaseCard>
    </div>

    <!-- Cases style (for before/after or score) -->
    <div v-else-if="cases.length > 0" class="mt-component-md grid gap-component-lg md:grid-cols-2">
      <BaseCard
        v-for="(caseStudy, index) in cases"
        :key="index"
        padding="lg"
        shadow="none"
        rounded="lg"
        bordered
        hover="shadow"
      >
        <!-- Before/After style (for exam prep courses) -->
        <div
          v-if="caseStudy.before !== undefined && caseStudy.after !== undefined"
          class="flex items-center justify-around mb-component-sm"
        >
          <div class="text-center">
            <p class="text-body-sm text-meta mb-component-xs">{{ labels.before }}</p>
            <p class="text-3xl font-bold text-hint">{{ caseStudy.before }}</p>
          </div>
          <Icon name="mdi:arrow-right" class="w-8 h-8 text-primary" />
          <div class="text-center">
            <p class="text-body-sm text-meta mb-component-xs">{{ labels.after }}</p>
            <p class="text-3xl font-bold text-primary">{{ caseStudy.after }}</p>
          </div>
        </div>

        <!-- Score style (for SAT/standardized tests) -->
        <div v-else-if="caseStudy.score !== undefined" class="text-center mb-component-sm">
          <p class="text-4xl font-bold text-primary mb-component-xs">{{ caseStudy.score }}</p>
          <p v-if="caseStudy.admission" class="text-body-lg">
            {{ labels.admittedTo }} <span class="font-semibold">{{ caseStudy.admission }}</span>
          </p>
        </div>

        <div v-if="caseStudy.duration" class="text-center text-body-sm">
          {{ labels.duration }}: {{ caseStudy.duration }}
        </div>

        <NuxtImg
          v-if="showProof && caseStudy.proof"
          :src="caseStudy.proof"
          :alt="`Case study ${index + 1} proof`"
          class="mt-component-md rounded-button w-full object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, 50vw"
          format="webp"
        />
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CaseStudy {
  before?: number
  after?: number
  score?: number
  duration?: string
  proof?: string
  admission?: string
}

interface MaxResult {
  package: string
  score: string
}

interface ResultsLabels {
  before: string
  after: string
  duration: string
  admittedTo: string
}

interface ResultsData {
  title: string
  labels?: ResultsLabels
  maxResults?: MaxResult[]
  cases?: CaseStudy[]
  showProof?: boolean
}

const props = defineProps<{
  data: ResultsData
}>()

const title = computed(() => props.data.title)
const labels = computed(() => props.data.labels || { before: '', after: '', duration: '', admittedTo: '' })
const maxResults = computed(() => props.data.maxResults || [])
const cases = computed(() => props.data.cases || [])
const showProof = computed(() => props.data.showProof ?? false)
</script>
