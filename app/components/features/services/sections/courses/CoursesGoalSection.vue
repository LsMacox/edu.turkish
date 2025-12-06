<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8">
      <p v-if="description" class="text-lg text-gray-700 mb-8">
        {{ description }}
      </p>

      <div v-if="packages.length > 0" class="grid gap-6 md:grid-cols-3">
        <div
          v-for="(pkg, index) in packages"
          :key="index"
          class="border border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all"
        >
          <h3 class="text-xl font-semibold mb-2">{{ pkg.name }}</h3>
          <p class="text-2xl font-bold text-primary">{{ pkg.targetScore }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PackageTier {
  name: string
  targetScore: string
}

interface CourseGoalSectionProps {
  keyPrefix: string
  title?: string
  layout?: 'cards' | 'list'
}

const props = withDefaults(defineProps<CourseGoalSectionProps>(), {
  title: '',
  layout: 'cards',
})

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const description = computed(() => {
  const desc = t(`${props.keyPrefix}.description`)
  return desc !== `${props.keyPrefix}.description` ? desc : ''
})

const packages = computed(() => {
  const raw = tm(`${props.keyPrefix}.packages`) as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    name: t(`${props.keyPrefix}.packages.${index}.name`) as string,
    targetScore: t(`${props.keyPrefix}.packages.${index}.targetScore`) as string,
  })) as PackageTier[]
})
</script>
