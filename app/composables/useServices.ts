import type { ServiceCategoryListItem, ServiceCategoryDetail } from '~~/server/types/api/services'


export function useServices() {
  const { locale } = useI18n()

  async function fetchCategories(): Promise<ServiceCategoryListItem[]> {
    const response = await $fetch<{ categories: ServiceCategoryListItem[] }>(
      '/api/v1/services/categories',
      {
        query: {
          locale: locale.value,
        },
      },
    )

    return response.categories
  }

  async function fetchCategory(slug: string): Promise<ServiceCategoryDetail> {
    const response = await $fetch<{ category: ServiceCategoryDetail }>(`/api/v1/services/${slug}`, {
      query: {
        locale: locale.value,
      },
    })

    return response.category
  }

  return {
    fetchCategories,
    fetchCategory,
  }
}
