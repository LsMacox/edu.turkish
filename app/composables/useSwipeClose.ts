/**
 * Composable for handling swipe-to-close gesture
 * @param onClose - callback to execute when swipe threshold is reached
 * @param options - configuration options
 */
export function useSwipeClose(
  onClose: () => void,
  options: { threshold?: number; direction?: 'left' | 'right' } = {},
) {
  const { threshold = 80, direction = 'left' } = options
  const touchStartX = ref<number | null>(null)

  function onTouchStart(e: TouchEvent) {
    touchStartX.value = e.touches[0]?.clientX ?? null
  }

  function onTouchMove(e: TouchEvent) {
    if (touchStartX.value === null) return
    const currentX = e.touches[0]?.clientX ?? 0
    const delta = direction === 'left' ? touchStartX.value - currentX : currentX - touchStartX.value
    if (delta >= threshold) {
      onClose()
      resetTouch()
    }
  }

  function resetTouch() {
    touchStartX.value = null
  }

  return {
    onTouchStart,
    onTouchMove,
    resetTouch,
  }
}
