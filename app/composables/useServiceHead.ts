interface ServiceHeadOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  schemaType?: string[]
}

export function useServiceHead(options: ServiceHeadOptions) {
  const schemaType = options.schemaType ?? ['Product', 'Service']

  useHead(() => {
    const title = toValue(options.title)
    const description = toValue(options.description)

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
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
              sameAs: 'https://edu-turkish.com',
            },
          }),
        },
      ],
    }
  })
}
