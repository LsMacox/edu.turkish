const HIGHLIGHT_OPEN = '<mark class="bg-yellow-200 font-medium">'
const HIGHLIGHT_CLOSE = '</mark>'

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Highlights search terms in text with <mark> tags.
 * First highlights exact phrase match, then individual words.
 */
export const highlightSearchTerms = (text: string, query: string): string => {
  if (!query.trim()) return text

  const normalized = query.toLowerCase().trim()
  const words = normalized.split(/\s+/).filter((w) => w.length > 1)

  let result = text.replace(
    new RegExp(`(${escapeRegex(normalized)})`, 'gi'),
    `${HIGHLIGHT_OPEN}$1${HIGHLIGHT_CLOSE}`,
  )

  words.forEach((word) => {
    result = result.replace(
      new RegExp(`(?!<mark[^>]*>)(${escapeRegex(word)})(?![^<]*</mark>)`, 'gi'),
      `${HIGHLIGHT_OPEN}$1${HIGHLIGHT_CLOSE}`,
    )
  })

  return result
}
