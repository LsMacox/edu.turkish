<template>
  <section id="video-reviews" class="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-6">
          {{ $t('reviews.videoReviews.title') }}
          <span class="text-primary">{{ $t('reviews.videoReviews.titleAccent') }}</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('reviews.videoReviews.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
        <!-- Video Review 1 -->
        <div class="bg-white rounded-3xl shadow-custom overflow-hidden">
          <div class="relative aspect-video bg-gray-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <button
                class="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                @click="playVideo('video1')"
              >
                <Icon
                  name="mdi:play"
                  class="text-white text-3xl ml-1 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/video-thumb-1.jpg"
              :alt="$t('reviews.videoReviews.videos.aigerim.alt')"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                :alt="$t('reviews.videoReviews.videos.aigerim.name')"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <h3 class="font-bold text-secondary">
                  {{ $t('reviews.videoReviews.videos.aigerim.name') }}
                </h3>
                <p class="text-sm text-primary">
                  {{ $t('reviews.videoReviews.videos.aigerim.university') }}
                </p>
              </div>
              <div class="ml-auto text-sm text-gray-500">3:24</div>
            </div>
            <p class="text-gray-700">
              {{ $t('reviews.videoReviews.videos.aigerim.description') }}
            </p>
          </div>
        </div>

        <!-- Video Review 2 -->
        <div class="bg-white rounded-3xl shadow-custom overflow-hidden">
          <div class="relative aspect-video bg-gray-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <button
                class="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                @click="playVideo('video2')"
              >
                <Icon
                  name="mdi:play"
                  class="text-white text-3xl ml-1 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/video-thumb-2.jpg"
              :alt="$t('reviews.videoReviews.videos.arman.alt')"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                :alt="$t('reviews.videoReviews.videos.arman.name')"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <h3 class="font-bold text-secondary">
                  {{ $t('reviews.videoReviews.videos.arman.name') }}
                </h3>
                <p class="text-sm text-primary">
                  {{ $t('reviews.videoReviews.videos.arman.university') }}
                </p>
              </div>
              <div class="ml-auto text-sm text-gray-500">4:17</div>
            </div>
            <p class="text-gray-700">
              {{ $t('reviews.videoReviews.videos.arman.description') }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Video Review 3 -->
        <div class="bg-white rounded-3xl shadow-custom overflow-hidden">
          <div class="relative aspect-video bg-gray-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <button
                class="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                @click="playVideo('video3')"
              >
                <Icon
                  name="mdi:play"
                  class="text-white text-2xl ml-1 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/video-thumb-3.jpg"
              :alt="$t('reviews.videoReviews.videos.dinara.alt')"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-5">
            <div class="flex items-center space-x-3 mb-3">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
                :alt="$t('reviews.videoReviews.videos.dinara.name')"
                class="w-10 h-10 rounded-full"
              />
              <div class="flex-1">
                <h3 class="font-bold text-secondary text-sm">
                  {{ $t('reviews.videoReviews.videos.dinara.name') }}
                </h3>
                <p class="text-xs text-primary">
                  {{ $t('reviews.videoReviews.videos.dinara.university') }}
                </p>
              </div>
              <div class="text-xs text-gray-500">2:45</div>
            </div>
            <p class="text-gray-700 text-sm">
              {{ $t('reviews.videoReviews.videos.dinara.description') }}
            </p>
          </div>
        </div>

        <!-- Video Review 4 -->
        <div class="bg-white rounded-3xl shadow-custom overflow-hidden">
          <div class="relative aspect-video bg-gray-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <button
                class="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                @click="playVideo('video4')"
              >
                <Icon
                  name="mdi:play"
                  class="text-white text-2xl ml-1 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/video-thumb-4.jpg"
              :alt="$t('reviews.videoReviews.videos.alexander.alt')"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-5">
            <div class="flex items-center space-x-3 mb-3">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                :alt="$t('reviews.videoReviews.videos.alexander.name')"
                class="w-10 h-10 rounded-full"
              />
              <div class="flex-1">
                <h3 class="font-bold text-secondary text-sm">
                  {{ $t('reviews.videoReviews.videos.alexander.name') }}
                </h3>
                <p class="text-xs text-primary">
                  {{ $t('reviews.videoReviews.videos.alexander.university') }}
                </p>
              </div>
              <div class="text-xs text-gray-500">3:52</div>
            </div>
            <p class="text-gray-700 text-sm">
              {{ $t('reviews.videoReviews.videos.alexander.description') }}
            </p>
          </div>
        </div>

        <!-- Video Review 5 -->
        <div class="bg-white rounded-3xl shadow-custom overflow-hidden">
          <div class="relative aspect-video bg-gray-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <button
                class="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                @click="playVideo('video5')"
              >
                <Icon
                  name="mdi:play"
                  class="text-white text-2xl ml-1 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/video-thumb-5.jpg"
              :alt="$t('reviews.videoReviews.videos.asel.alt')"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-5">
            <div class="flex items-center space-x-3 mb-3">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
                :alt="$t('reviews.videoReviews.videos.asel.name')"
                class="w-10 h-10 rounded-full"
              />
              <div class="flex-1">
                <h3 class="font-bold text-secondary text-sm">
                  {{ $t('reviews.videoReviews.videos.asel.name') }}
                </h3>
                <p class="text-xs text-primary">
                  {{ $t('reviews.videoReviews.videos.asel.university') }}
                </p>
              </div>
              <div class="text-xs text-gray-500">2:18</div>
            </div>
            <p class="text-gray-700 text-sm">
              {{ $t('reviews.videoReviews.videos.asel.description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12 md:mt-16">
        <div class="bg-white rounded-3xl shadow-custom p-6 md:p-8 max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold text-secondary mb-4">
            {{ $t('reviews.videoReviews.cta.title') }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ $t('reviews.videoReviews.cta.description') }}
          </p>
          <button
            class="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            @click="modal.openModal()"
          >
            {{ $t('reviews.videoReviews.cta.button') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Video Modal (placeholder) -->
    <div
      v-if="activeVideo"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeVideo"
    >
      <div class="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ $t('reviews.videoReviews.modal.title') }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeVideo">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
        </div>
        <div class="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
          <p class="text-white">{{ $t('reviews.videoReviews.modal.placeholder') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()
const activeVideo = ref<string | null>(null)

function playVideo(videoId: string) {
  activeVideo.value = videoId
}

function closeVideo() {
  activeVideo.value = null
}
</script>

