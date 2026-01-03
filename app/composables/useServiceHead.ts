interface ServiceHeadOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  schemaType?: string[]
}

export function useServiceHead(options: ServiceHeadOptions) {
  const schemaType = options.schemaType ?? ['Product', 'Service']
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'
  const route = useRoute()
  const localePath = useLocalePath()

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
  })

  useHead(() => {
    const title = toValue(options.title)
    const description = toValue(options.description)

    return {
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': schemaType,
            name: title,
            description,
            provider: {
              '@type': 'Organization',
              name: 'Edu.turkish',
              sameAs: siteUrl,
            },
          }),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: title,
                item: `${siteUrl}${localePath(route.path)}`,
              },
            ],
          }),
        },
      ],
    }
  })
}
