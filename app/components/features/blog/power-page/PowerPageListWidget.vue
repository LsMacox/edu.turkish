<template>
  <div class="w-full">
    <!-- Steps Visualization -->
    <div v-if="listStyle === 'steps'" class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
      >
        <!-- Icon -->
        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
          <span class="text-sm font-bold">{{ index + 1 }}</span>
        </div>
        
        <!-- Content -->
        <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="font-medium text-gray-800" v-html="item" />
        </div>
      </div>
    </div>

    <!-- Checklist Visualization -->
    <ul v-else-if="listStyle === 'checklist'" class="space-y-3">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="flex items-start gap-3 p-4 bg-green-50/50 rounded-xl border border-green-100"
      >
        <Icon name="mdi:check-circle" class="text-xl text-green-500 shrink-0 mt-0.5" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="text-gray-700" v-html="item" />
      </li>
    </ul>

    <!-- Standard List (Fallback) -->
    <component
      :is="ordered ? 'ol' : 'ul'"
      v-else
      class="pl-6 space-y-3 text-gray-700"
      :class="ordered ? 'list-decimal' : 'list-disc'"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <li v-for="(item, i) in items" :key="i" v-html="item" />
    </component>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: string[]
  ordered?: boolean
  listStyle?: 'standard' | 'checklist' | 'steps'
}>()
</script>
