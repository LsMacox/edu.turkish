<template>
  <div class="container section-py">
    <!-- Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" />

    <!-- Sub-Services Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
      <slot name="sub-services" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>
