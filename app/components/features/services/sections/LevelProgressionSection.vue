<template>
  <div class="mt-16">
    <BaseSectionHeader :title="computedTitle" />

    <div v-if="levels.length > 0" class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(level, index) in levels"
        :key="index"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="mb-4 flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-primary">{{ level.from }}</span>
            <Icon name="mdi:arrow-right" class="h-6 w-6 text-gray-400" />
            <span class="text-2xl font-bold text-primary">{{ level.to }}</span>
          </div>
        </div>
        <p class="text-gray-700">{{ level.outcome }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LevelProgressionSectionProps {
  keyPrefix: string
  title?: string
}

const props = withDefaults(defineProps<LevelProgressionSectionProps>(), {
  title: '',
})

const { t, tm } = useI18n()

const computedTitle = computed(() => props.title || (t(`${props.keyPrefix}.title`) as string))

const levels = computed(() => {
  const raw = (tm(`${props.keyPrefix}.levels`) || []) as unknown[]
  return raw.map((_, index) => ({
    from: t(`${props.keyPrefix}.levels.${index}.from`) as string,
    to: t(`${props.keyPrefix}.levels.${index}.to`) as string,
    outcome: t(`${props.keyPrefix}.levels.${index}.outcome`) as string,
  }))
})
</script>
