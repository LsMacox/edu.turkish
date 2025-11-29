export const useCdn = () => {
  const config = useRuntimeConfig()
  const cdnUrl = config.public.cdnUrl as string

  const getCdnUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('blob:')) return path
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const cleanBase = cdnUrl.endsWith('/') ? cdnUrl.slice(0, -1) : cdnUrl
    
    if (!cleanBase) return `/${cleanPath}`

    return `${cleanBase}/${cleanPath}`
  }

  return {
    getCdnUrl
  }
}
