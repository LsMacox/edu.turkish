<template>
  <BaseSection padding="lg" bg="primary" max-width="4xl" class="text-center">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-component-lg leading-tight">
          {{ title }}
        </h2>
        <BaseButton
          variant="inverted"
          size="lg"
          :icon="icon"
          rounded="lg"
          class="shadow-card-interactive w-full sm:w-auto"
          @click="handleClick"
        >
          {{ buttonText }}
        </BaseButton>
  </BaseSection>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  buttonText: string
  icon?: string
}>()

const modal = useApplicationModal()

const handleClick = () => {
  modal.openModal({
    source: 'service_page',
    description: props.buttonText,
  })
}
</script>
