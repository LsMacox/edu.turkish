<template>
  <DisplayFAQ :items="items" bare accordion html-content />
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ question: string; answer: string }>
}>()
</script>
