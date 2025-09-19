<template>
  <section class="py-16 bg-background">
    <div class="container">
      <div v-if="displayTitle || displaySubtitle" class="text-center mb-12">
        <h2 v-if="displayTitle" class="text-3xl lg:text-4xl font-bold text-secondary mb-4">
          {{ displayTitle }}
        </h2>
        <p v-if="displaySubtitle" class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ displaySubtitle }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="space-y-4">
          <div
            v-for="(faq, index) in items"
            :key="`${index}-${faq.question}`"
            class="bg-white rounded-xl shadow-custom"
          >
            <button
              class="w-full px-6 py-4 text-left font-semibold text-secondary hover:text-primary transition-colors flex items-center justify-between"
              @click="toggle(index)"
            >
              <span>{{ faq.question }}</span>
              <Icon
                :name="isOpen(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="transition-transform duration-200"
              />
            </button>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-show="isOpen(index)" class="px-6 pb-4 text-gray-600" v-html="faq.answer"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
}

interface Props {
  items?: FaqItem[]
  title?: string
  subtitle?: string
}

const { t, locale } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  title: '',
  subtitle: '',
})

// Use i18n defaults if no props are provided
const displayTitle = computed(() => props.title || t('home.faq.title'))
const displaySubtitle = computed(() => props.subtitle || t('home.faq.subtitle'))

const openFaqs = ref<number[]>([])

// Reset open state when locale changes
watch(locale, () => {
  openFaqs.value = []
})

const toggle = (index: number) => {
  const currentIndex = openFaqs.value.indexOf(index)
  if (currentIndex > -1) {
    openFaqs.value.splice(currentIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const isOpen = (index: number) => openFaqs.value.includes(index)
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
