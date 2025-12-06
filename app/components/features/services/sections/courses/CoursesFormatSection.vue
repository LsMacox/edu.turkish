<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 bg-gray-50 rounded-lg p-8">
      <dl class="grid gap-6 md:grid-cols-2">
        <div
          v-for="detail in formatDetails"
          :key="detail.key"
          class="border-l-4 border-primary pl-4"
        >
          <dt class="text-sm font-semibold text-gray-500 uppercase mb-1">
            {{ detail.label }}
          </dt>
          <dd class="text-lg text-gray-900">
            {{ detail.value }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormatScheduleSectionProps {
  keyPrefix: string
  title?: string
}

const props = withDefaults(defineProps<FormatScheduleSectionProps>(), {
  title: '',
})

const { t, te } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

interface FormatDetail {
  key: string
  label: string
  value: string
}

const formatDetails = computed<FormatDetail[]>(() => {
  const details: FormatDetail[] = []

  // Dynamically collect all keys from the i18n object
  const keys = [
    'format',
    'duration',
    'homework',
    'support',
    'enrollmentSchedule',
    'recordings',
    'taskBank',
    'groupSize',
    'individual',
    'conversationClubs',
    'schedule',
    'platform',
    'certificate',
  ]

  keys.forEach((key) => {
    const fullKey = `${props.keyPrefix}.${key}`
    if (!te(fullKey)) {
      return
    }
    const raw = t(fullKey) as unknown as string
    const labelKey = `${props.keyPrefix}.labels.${key}`
    const label = te(labelKey)
      ? (t(labelKey) as unknown as string) || formatKey(key)
      : formatKey(key)
    details.push({
      key,
      label,
      value: raw,
    })
  })

  return details
})

const formatKey = (key: string): string => {
  // Convert camelCase to Title Case
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}
</script>
