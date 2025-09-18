import { createDirectus, rest, staticToken } from '@directus/sdk'

export interface DirectusClients {
  server: ReturnType<typeof createDirectus>
  public: ReturnType<typeof createDirectus>
}

export function getDirectusClients(): DirectusClients {
  const config = useRuntimeConfig()
  const baseUrl = config.public.directusUrl
  const token = config.directusStaticToken

  const base = createDirectus(baseUrl).with(rest())
  const server = token ? base.with(staticToken(token)) : base
  const publicClient = base

  return { server, public: publicClient }
}

