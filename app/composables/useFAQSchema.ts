import type { Ref } from 'vue'

export interface FAQSchemaItem {
  question: string
  answer: string | { title?: string; items?: string[]; ordered?: boolean }
}

/**
 * Composable to inject Schema.org FAQPage structured data
 * @param items Array of FAQ items
 */
export const useFAQSchema = (items: Ref<FAQSchemaItem[]> | FAQSchemaItem[]) => {
  const resolveAnswerText = (answer: FAQSchemaItem['answer']): string => {
    if (typeof answer === 'string') return answer
    
    let html = ''
    if (answer.title) {
      html += `<p><strong>${answer.title}</strong></p>`
    }
    
    if (answer.items?.length) {
      const tag = answer.ordered ? 'ol' : 'ul'
      html += `<${tag}>`
      answer.items.forEach(item => {
        html += `<li>${item}</li>`
      })
      html += `</${tag}>`
    }
    
    return html
  }

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
            mainEntity: faqItems.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: resolveAnswerText(item.answer)
              }
            }))
          })
        })
      }
    ]
  })
}
