import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useApplicationModalStore } from '~/stores/applicationModal'

describe('useApplicationModalStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Ensure document.body exists and is clean
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  })

  afterEach(() => {
    if (typeof document !== 'undefined') {
      document.body.style.removeProperty('overflow')
    }
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
