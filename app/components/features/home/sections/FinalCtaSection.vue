<template>
  <BaseSection id="final-cta" padding="lg" bg="primary-gradient" max-width="4xl" class="text-center">
        <h2 class="text-section-title mb-component-md text-white">
          {{ t(finalCtaNs('title')) }}
        </h2>
        <p class="text-body-lg mb-component-md opacity-90 text-white">
          {{ t(finalCtaNs('subtitle'), { days: timeLeft.days }) }}
        </p>

        <!-- Countdown Timer -->
        <div class="flex justify-center gap-3 sm:gap-component-xl mb-component-lg">
          <div class="text-center">
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold bg-white text-primary shadow-card"
            >
              {{ timeLeft.days }}
            </div>
            <p class="text-body-sm mt-component-xs text-white">{{ t(finalCtaNs('days')) }}</p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold bg-white text-primary shadow-card"
            >
              {{ timeLeft.hours }}
            </div>
            <p class="text-body-sm mt-component-xs text-white">{{ t(finalCtaNs('hours')) }}</p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold bg-white text-primary shadow-card"
            >
              {{ timeLeft.minutes }}
            </div>
            <p class="text-body-sm mt-component-xs text-white">{{ t(finalCtaNs('minutes')) }}</p>
          </div>
        </div>

        <div class="space-component-md">
          <BaseButton
            variant="inverted"
            size="lg"
            class="w-full sm:w-auto"
            @click="modal.openModal({ source: 'home_final_cta', description: t(finalCtaNs('button')) })"
          >
            {{ t(finalCtaNs('button')) }}
          </BaseButton>
          <p class="text-body-sm opacity-80 text-white">
            {{ t(finalCtaNs('guarantee')) }}
          </p>
        </div>
  </BaseSection>
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

const forceUpdate = ref(0)

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

const timeLeft = computed(() => {
  void forceUpdate.value
  return calculateTimeLeft()
})

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
</style>
