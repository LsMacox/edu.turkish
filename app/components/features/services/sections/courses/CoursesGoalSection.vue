<template>
  <div class="mt-component-lg">
    <BaseSectionHeader :title="title" />

    <div class="mt-component-lg">
      <p v-if="description" class="text-body-lg mb-component-lg">
        {{ description }}
      </p>

      <BaseGrid v-if="packages.length > 0" :md="3" gap="lg">
        <div
          v-for="(pkg, index) in packages"
          :key="index"
          class="border border-default rounded-button card-padding hover:border-primary hover:shadow-card transition-default"
        >
          <h3 class="text-card-title mb-component-xs">{{ pkg.name }}</h3>
          <p class="text-2xl font-bold text-primary">{{ pkg.targetScore }}</p>
        </div>
      </BaseGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PackageTier {
  name: string
  targetScore: string
}

const props = defineProps<{
  title: string
  description?: string
  packages: PackageTier[]
}>()

const title = computed(() => props.title)
const description = computed(() => props.description)
const packages = computed(() => props.packages)
</script>
