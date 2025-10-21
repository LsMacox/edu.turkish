import type { ServiceCategoryListItem, ServiceCategoryDetail } from '~~/server/types/api/services'

/**
 * Composable for fetching service data from the database API
 */
export function useServices() {
  const { locale } = useI18n()

  /**
   * Fetch all service categories with translations
   */
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

  /**
   * Fetch a specific service category by slug with sub-services
   */
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
