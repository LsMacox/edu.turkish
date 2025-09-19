type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: number
  title?: string
  message: string
  type: ToastType
  duration: number
}

export const useToast = () => {
  const toasts = useState<ToastItem[]>('ui:toasts', () => [])
  const counter = useState<number>('ui:toasts:counter', () => 1)

  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const show = (
    message: string,
    options: { title?: string; type?: ToastType; duration?: number } = {},
  ) => {
    const id = counter.value++
    const toast: ToastItem = {
      id,
      message,
      title: options.title,
      type: options.type || 'success',
      duration: options.duration ?? 4000,
    }
    toasts.value.push(toast)
    if (process.client) {
      window.setTimeout(() => remove(id), toast.duration)
    }
    return id
  }

  return {
    toasts,
    show,
    remove,
  }
}
