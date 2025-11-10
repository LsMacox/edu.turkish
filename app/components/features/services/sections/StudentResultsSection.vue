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

        <img
          v-if="showProof && caseStudy.proof"
          :src="caseStudy.proof"
          :alt="`Case study ${index + 1} proof`"
          class="mt-4 rounded-lg w-full object-cover"
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

interface StudentResultsSectionProps {
  keyPrefix: string
  title?: string
  showProof?: boolean
}

const props = withDefaults(defineProps<StudentResultsSectionProps>(), {
  title: '',
  showProof: false,
})

const { t, tm, locale: _locale, messages: _messages } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const labels = computed(() => ({
  before: t(`${props.keyPrefix}.labels.before`),
  after: t(`${props.keyPrefix}.labels.after`),
  duration: t(`${props.keyPrefix}.labels.duration`),
  admittedTo: t(`${props.keyPrefix}.labels.admittedTo`),
}))

const maxResults = computed(() => {
  const rawMaxResults = tm(`${props.keyPrefix}.maxResults`) as any

  // Ensure rawMaxResults is an array
  if (!rawMaxResults || !Array.isArray(rawMaxResults)) {
    return []
  }

  return rawMaxResults.map((_: any, index: number) => ({
    package: t(`${props.keyPrefix}.maxResults.${index}.package`),
    score: t(`${props.keyPrefix}.maxResults.${index}.score`),
  }))
})

const cases = computed(() => {
  // Use tm() to read the array of case objects directly. Using t() for numeric
  // fields like before/after returns the key string fallback, so we must read
  // structured values from the raw message instead.
  const rawCases = tm(`${props.keyPrefix}.cases`) as any

  // Ensure rawCases is an array
  if (!rawCases || !Array.isArray(rawCases)) {
    return []
  }

  return (rawCases as Record<string, unknown>[]).map((item) => {
    const caseStudy: CaseStudy = {}

    const before = (item as any).before
    if (typeof before === 'number') {
      caseStudy.before = before
    }

    const after = (item as any).after
    if (typeof after === 'number') {
      caseStudy.after = after
    }

    const score = (item as any).score
    if (typeof score === 'number') {
      caseStudy.score = score
    }

    const duration = (item as any).duration
    if (typeof duration === 'string') {
      caseStudy.duration = duration
    }

    const proof = (item as any).proof
    if (typeof proof === 'string') {
      caseStudy.proof = proof
    }

    const admission = (item as any).admission
    if (typeof admission === 'string') {
      caseStudy.admission = admission
    }

    return caseStudy
  }) as CaseStudy[]
})
</script>
