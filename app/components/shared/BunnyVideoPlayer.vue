<template>
  <div
    class="relative w-full overflow-hidden"
    :class="[roundedClass, backgroundClass]"
    :style="containerStyle"
  >
    <img
      v-if="previewUrl && (!shouldLoad || !iframeLoaded)"
      :src="previewUrl"
      :alt="title"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <iframe
      v-if="shouldLoad"
      :src="embedUrl"
      :title="title"
      loading="lazy"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      class="border-0"
      :class="[
        fit === 'cover' ? 'video-cover' : 'absolute inset-0 w-full h-full',
      ]"
      @load="iframeLoaded = true"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoId: string
  libraryId: number
  title?: string
  aspectRatio?: string
  rounded?: 'none' | 'md' | 'lg' | 'xl' | 'card'
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  deferred?: boolean
  backgroundClass?: string
  fit?: 'contain' | 'cover'
  posterUrl?: string
  videoCdnUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Video',
  aspectRatio: '16/9',
  rounded: 'card',
  autoplay: false,
  muted: false,
  loop: false,
  controls: true,
  deferred: false,
  backgroundClass: 'bg-neutral-900',
  fit: 'contain',
})

const shouldLoad = ref(!props.deferred)
const iframeLoaded = ref(false)

onMounted(() => {
  if (props.deferred) {
    // Load after page is interactive
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        shouldLoad.value = true
      })
    } else {
      setTimeout(() => {
        shouldLoad.value = true
      }, 100)
    }
  }
})

watch(
  () => props.videoId,
  () => {
    iframeLoaded.value = false
  },
)

const ROUNDED_MAP: Record<string, string> = {
  none: '',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  card: 'rounded-card',
}

const roundedClass = computed(() => ROUNDED_MAP[props.rounded] || '')

const containerStyle = computed(() => {
  if (props.fit === 'cover') return {} // Let CSS handle sizing
  // If aspect ratio is 'free' or 'full', let CSS handle dimensions (e.g. h-full w-full)
  if (props.aspectRatio === 'free' || props.aspectRatio === 'full') return {}
  // If no aspect ratio is provided but not explicitly free/full, fallback to default behavior
  if (!props.aspectRatio) return {}
  return { aspectRatio: props.aspectRatio }
})

const previewUrl = computed(() => {
  if (props.posterUrl) return props.posterUrl
  const base = props.videoCdnUrl?.replace(/\/+$/, '')
  if (base) return `${base}/${props.videoId}/thumbnail.jpg`
  return `https://vz-${props.libraryId}.b-cdn.net/${props.videoId}/thumbnail.jpg`
})

const embedUrl = computed(() => {
  const params = new URLSearchParams()
  
  if (props.autoplay) params.set('autoplay', 'true')
  if (props.muted) params.set('muted', 'true')
  if (props.loop) params.set('loop', 'true')
  
  if (!props.controls) {
    params.set('controls', '0')
    params.set('showPlayButton', 'false')
    params.set('transparentBackground', 'true')
  } else {
    params.set('controls', '1')
  }
  
  params.set('playsinline', 'true')
  params.set('preload', 'true')
  params.set('responsive', 'true')
  
  return `https://iframe.mediadelivery.net/embed/${props.libraryId}/${props.videoId}?${params}`
})
</script>

<style scoped>
.video-cover {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 56.25vw; /* 16:9 ratio */
  min-height: 100%;
  min-width: 177.77vh; /* 16:9 ratio */
  transform: translate(-50%, -50%);
}
</style>
