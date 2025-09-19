import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useApplicationModalStore } from '~/stores/applicationModal'

describe('useApplicationModalStore', () => {
  let originalProcessClient: boolean | undefined

  beforeEach(() => {
    setActivePinia(createPinia())
    originalProcessClient = (process as any).client
    ;(process as any).client = true
  })

  afterEach(() => {
    ;(process as any).client = originalProcessClient
    document.body.style.removeProperty('overflow')
  })

  it('restores previous body overflow on close', () => {
    document.body.style.overflow = 'clip'
    const store = useApplicationModalStore()

    store.openModal()
    expect(document.body.style.overflow).toBe('hidden')

    store.closeModal()
    expect(document.body.style.overflow).toBe('clip')
  })
})
