import type { Ref } from 'vue'
import type { FaqItem } from '~~/lib/types/entities/faq'

export const useFaqSchema = (items: Ref<FaqItem[]> | FaqItem[]) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => {
          const faqItems = isRef(items) ? items.value : items

          if (!faqItems?.length) return ''

          return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })
        }),
      },
    ],
  })
}
