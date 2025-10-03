<template>
  <section class="py-16 bg-background">
    <div class="container">
      <div v-if="displayTitle || displaySubtitle" class="text-center mb-12">
        <h2 v-if="displayTitle" class="text-section-title mb-4">
          {{ displayTitle }}
        </h2>
        <p v-if="displaySubtitle" class="text-section-subtitle max-w-2xl mx-auto">
          {{ displaySubtitle }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="space-y-4">
          <div v-for="(faq, index) in items" :key="index" class="bg-white rounded-xl shadow-custom">
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
            <div v-show="isOpen(index)" class="px-6 pb-4 text-gray-600">
              <template v-if="isStringAnswer(faq.answer)">
                <p>{{ faq.answer }}</p>
              </template>
              <div v-else class="space-y-3">
                <p v-if="faq.answer.title" class="font-medium text-gray-700">
                  {{ faq.answer.title }}
                </p>
                <ul
                  v-if="faq.answer.items?.length && !faq.answer.ordered"
                  class="list-disc pl-5 space-y-1"
                >
                  <li v-for="(item, itemIndex) in faq.answer.items" :key="itemIndex">
                    {{ item }}
                  </li>
                </ul>
                <ol v-else-if="faq.answer.items?.length" class="list-decimal pl-5 space-y-1">
                  <li v-for="(item, itemIndex) in faq.answer.items" :key="itemIndex">
                    {{ item }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FaqStructuredAnswer {
  title?: string
  items?: string[]
  ordered?: boolean
}

type FaqAnswer = string | FaqStructuredAnswer

interface FaqItem {
  question: string
  answer: FaqAnswer
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

const isStringAnswer = (answer: FaqAnswer): answer is string => typeof answer === 'string'
</script>
