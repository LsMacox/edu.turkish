interface ServiceHeadOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  schemaType?: string[]
}

export function useServiceHead(options: ServiceHeadOptions) {
  const schemaType = options.schemaType ?? ['Product', 'Service']

  useHead(() => ({
    title: toValue(options.title),
    meta: [{ name: 'description', content: toValue(options.description) }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': schemaType,
          name: toValue(options.title),
          description: toValue(options.description),
          provider: {
            '@type': 'Organization',
            name: 'Edu.turkish',
            sameAs: 'https://edu-turkish.com',
          },
        }),
      },
    ],
  }))
}
