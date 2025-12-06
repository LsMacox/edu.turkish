export function useI18nList() {
  const { t, tm } = useI18n()

  function getListStrings(key: string): string[] {
    const raw = tm(key)
    if (!Array.isArray(raw)) return []
    return raw.map((_, idx) => t(`${key}[${idx}]`))
  }

  function getListObjects<T extends Record<string, unknown>>(
    key: string,
    fields: (keyof T)[],
  ): T[] {
    const raw = tm(key)
    if (!Array.isArray(raw)) return []
    return raw.map((_, index) => {
      const obj = {} as T
      for (const field of fields) {
        obj[field] = String(t(`${key}.${index}.${String(field)}`)) as T[typeof field]
      }
      return obj
    })
  }

  return { getListStrings, getListObjects }
}
