<template>
  <section id="final-cta" class="section-py-lg bg-gradient-to-r from-primary to-red-600">
    <div class="container mx-auto container-padding-narrow text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-section-title mb-6 text-white">
          {{ t(finalCtaNs('title')) }}
        </h2>
        <p class="text-body-lg mb-8 opacity-90 text-white">
          {{ t(finalCtaNs('subtitle'), { days: timeLeft.days }) }}
        </p>

        <!-- Countdown Timer -->
        <div class="flex justify-center space-x-8 mb-8">
          <div class="text-center">
            <div
              class="text-3xl font-bold bg-white text-primary rounded-xl p-4 w-16 h-16 flex items-center justify-center"
            >
              {{ timeLeft.days }}
            </div>
            <p class="text-sm mt-2 text-white">{{ t(finalCtaNs('days')) }}</p>
          </div>
          <div class="text-center">
            <div
              class="text-3xl font-bold bg-white text-primary rounded-xl p-4 w-16 h-16 flex items-center justify-center"
            >
              {{ timeLeft.hours }}
            </div>
            <p class="text-sm mt-2 text-white">{{ t(finalCtaNs('hours')) }}</p>
          </div>
          <div class="text-center">
            <div
              class="text-3xl font-bold bg-white text-primary rounded-xl p-4 w-16 h-16 flex items-center justify-center"
            >
              {{ timeLeft.minutes }}
            </div>
            <p class="text-sm mt-2 text-white">{{ t(finalCtaNs('minutes')) }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <button
            class="bg-white text-primary px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 shadow-2xl"
            @click="modal.openModal({ source: 'home_final_cta', description: t(finalCtaNs('button')) })"
          >
            {{ t(finalCtaNs('button')) }}
          </button>
          <p class="text-sm opacity-80 text-white">
            {{ t(finalCtaNs('guarantee')) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

interface Props {
  deadline?: string | Date
  fallbackDays?: number
  fallbackHours?: number
  fallbackMinutes?: number
}

const props = withDefaults(defineProps<Props>(), {
  deadline: '2025-11-15T23:59:59',
  fallbackDays: 45,
  fallbackHours: 12,
  fallbackMinutes: 35,
})

const finalCtaNs = namespace('home.final_cta')
const { t } = useI18n()
const modal = useApplicationModal()

// Force reactivity update every minute
const forceUpdate = ref(0)

// Calculate time left to deadline
const calculateTimeLeft = () => {
  const now = new Date().getTime()
  const deadline = new Date(props.deadline).getTime()
  const distance = deadline - now

  if (distance > 0) {
    const result = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    }
    return result
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }
}

// Reactive computed property for time left
const timeLeft = computed(() => {
  // Include forceUpdate to trigger reactivity every minute
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  forceUpdate.value
  return calculateTimeLeft()
})

// Update countdown on mount and every minute
onMounted(() => {
  const interval = setInterval(() => {
    forceUpdate.value++
  }, 60000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
/* Additional styles for gradient and animations */
</style>
