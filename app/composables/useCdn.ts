export const useCdn = () => {
  const cdnUrl = (useRuntimeConfig().public.cdnUrl as string).replace(/\/$/, '')

  const getCdnUrl = (path: string) => {
    if (!path || path.startsWith('http') || path.startsWith('blob:')) return path || ''
    const cleanPath = path.replace(/^\//, '')
    return cdnUrl ? `${cdnUrl}/${cleanPath}` : `/${cleanPath}`
  }

  return { getCdnUrl }
}
