import { toCdnUrl } from '~/utils/cdn'

/**
 * CDN transformation composable
 *
 * Provides a reactive function to transform asset paths to CDN URLs
 * using the runtime configuration.
 *
 * @returns Object with cdnUrl transformation function
 *
 * @example
 * ```vue
 * <script setup>
 * const { cdnUrl } = useCdn()
 * const logoUrl = cdnUrl('/images/universities/logo.png')
 * </script>
 *
 * <template>
 *   <img :src="cdnUrl('/images/universities/logo.png')" />
 *   <NuxtImg :src="cdnUrl('/images/reviews/photo.jpg')" />
 * </template>
 * ```
 */
export function useCdn() {
  const config = useRuntimeConfig()

  return {
    /**
     * Transform asset path to CDN URL
     *
     * @param path - Asset path (absolute or relative)
     * @returns CDN URL or original path if CDN is disabled
     */
    cdnUrl: (path: string) => toCdnUrl(path, config.public.cdnUrl as string),
  }
}
