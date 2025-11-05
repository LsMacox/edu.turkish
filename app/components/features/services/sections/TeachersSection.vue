<template>
  <div class="mt-16">
    <BaseSectionHeader :title="computedTitle" />

    <div v-if="methodology" class="mt-8 rounded-lg bg-gray-50 p-6">
      <p class="text-lg text-gray-700">{{ methodology }}</p>
    </div>

    <div v-if="profiles.length > 0" class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(profile, index) in profiles"
        :key="index"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="mb-4 flex justify-center">
          <img
            :src="resolvePhoto(profile.photo)"
            :alt="profile.name"
            class="h-32 w-32 rounded-full object-cover"
          />
        </div>
        <h3 class="mb-2 text-center text-xl font-semibold">{{ profile.name }}</h3>
        <p class="text-center text-gray-600">{{ profile.achievements }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeachersSectionProps {
  keyPrefix: string
  title?: string
}

const props = withDefaults(defineProps<TeachersSectionProps>(), {
  title: '',
})

const { t, tm } = useI18n()

const computedTitle = computed(() => props.title || (t(`${props.keyPrefix}.title`) as string))

const methodology = computed(() => {
  const value = t(`${props.keyPrefix}.methodology`)
  return value !== `${props.keyPrefix}.methodology` ? (value as string) : ''
})

const profiles = computed(() => {
  const raw = tm(`${props.keyPrefix}.profiles`) as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    name: t(`${props.keyPrefix}.profiles.${index}.name`) as string,
    photo: t(`${props.keyPrefix}.profiles.${index}.photo`) as string,
    achievements: t(`${props.keyPrefix}.profiles.${index}.achievements`) as string,
  }))
})

const { cdnUrl } = useCdn()

const resolvePhoto = (photo: string): string => {
  if (!photo || photo.includes('teacher-placeholder.jpg')) {
    return cdnUrl('c905b440-9cea-4b23-8576-f1787a84d356.png')
  }
  return photo
}
</script>
