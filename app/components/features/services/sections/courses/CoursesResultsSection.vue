<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <!-- Max Results style (for TR-YÖS) -->
    <div v-if="maxResults.length > 0" class="mt-8 grid gap-6 md:grid-cols-2">
      <div
        v-for="(result, index) in maxResults"
        :key="index"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow text-center"
      >
        <p class="text-lg text-gray-700 mb-2">{{ result.package }}</p>
        <p class="text-4xl font-bold text-primary">{{ result.score }}</p>
      </div>
    </div>

    <!-- Cases style (for before/after or score) -->
    <div v-else-if="cases.length > 0" class="mt-8 grid gap-8 md:grid-cols-2">
      <div
        v-for="(caseStudy, index) in cases"
        :key="index"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <!-- Before/After style (for exam prep courses) -->
        <div
          v-if="caseStudy.before !== undefined && caseStudy.after !== undefined"
          class="flex items-center justify-around mb-4"
        >
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ labels.before }}</p>
            <p class="text-3xl font-bold text-gray-400">{{ caseStudy.before }}</p>
          </div>
          <Icon name="mdi:arrow-right" class="w-8 h-8 text-primary" />
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ labels.after }}</p>
            <p class="text-3xl font-bold text-primary">{{ caseStudy.after }}</p>
          </div>
        </div>

        <!-- Score style (for SAT/standardized tests) -->
        <div v-else-if="caseStudy.score !== undefined" class="text-center mb-4">
          <p class="text-4xl font-bold text-primary mb-2">{{ caseStudy.score }}</p>
          <p v-if="caseStudy.admission" class="text-lg text-gray-700">
            {{ labels.admittedTo }} <span class="font-semibold">{{ caseStudy.admission }}</span>
          </p>
        </div>

        <div v-if="caseStudy.duration" class="text-center text-sm text-gray-600">
          {{ labels.duration }}: {{ caseStudy.duration }}
        </div>

        <NuxtImg
          v-if="showProof && caseStudy.proof"
          :src="caseStudy.proof"
          :alt="`Case study ${index + 1} proof`"
          class="mt-4 rounded-lg w-full object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, 50vw"
          format="webp"
        />
      </div>
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
