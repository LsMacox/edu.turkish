import type { ServiceCategoryDetail } from '~~/server/types/api/services'

export function useServiceCategory(slug: string) {
  const { locale } = useI18n()

  const { data: category } = useAsyncData(
    `${slug}-${locale.value}`,
    () =>
      $fetch<{ category: ServiceCategoryDetail }>(`/api/v1/services/${slug}`, {
        query: { locale: locale.value },
      }).then((r) => r.category),
    { watch: [locale] },
  )

  function metadataPath<T = unknown>(path: string): T | undefined {
    const meta = category.value?.metadata as Record<string, unknown> | undefined
    if (!meta) return undefined

    return path.split('.').reduce<unknown>((node, part) => {
      if (node && typeof node === 'object' && part in node) {
        return (node as Record<string, unknown>)[part]
      }
      return undefined
    }, meta) as T | undefined
  }

  return { category, metadataPath }
}
