<template>
  <div class="container section-py">
    <!-- Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" />

    <!-- Sub-Services Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
      <slot name="sub-services" />
    </div>

    <!-- How It Works Section -->
    <div v-if="$slots['how-it-works']" class="mt-16">
      <slot name="how-it-works" />
    </div>

    <!-- Why Choose Us Section -->
    <div v-if="$slots['why-choose-us']" class="mt-16">
      <slot name="why-choose-us" />
    </div>

    <!-- Trust Indicators -->
    <div v-if="$slots['trust-indicators']" class="mt-12 flex flex-wrap justify-center gap-4">
      <slot name="trust-indicators" />
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
