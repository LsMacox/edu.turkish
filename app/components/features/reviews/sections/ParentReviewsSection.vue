<template>
  <section id="parent-reviews" class="pt-10 pb-14 md:py-20 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-10 md:mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-6">
          {{ $t('reviews.parentReviews.title') }} <span class="text-primary">{{ $t('reviews.parentReviews.titleAccent') }}</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ $t('reviews.parentReviews.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Parent Review 1 -->
        <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.galina.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.galina.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.galina.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.galina.date') }}
          </div>
        </div>

        <!-- Parent Review 2 -->
        <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.nurzhan.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.nurzhan.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.nurzhan.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.nurzhan.date') }}
          </div>
        </div>

        <!-- Parent Review 3 -->
        <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.almagul.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.almagul.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.almagul.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.almagul.date') }}
          </div>
        </div>

        <!-- Parent Review 4 -->
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.sergey.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.sergey.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.sergey.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.sergey.date') }}
          </div>
        </div>

        <!-- Parent Review 5 -->
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.zhanna.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.zhanna.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.zhanna.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.zhanna.date') }}
          </div>
        </div>

        <!-- Parent Review 6 -->
        <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 md:p-8 shadow-custom h-full flex flex-col">
          <div class="flex items-center space-x-4 mb-6">
            <div>
              <h3 class="font-bold text-secondary">{{ $t('reviews.parentReviews.parents.rustam.name') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('reviews.parentReviews.parents.rustam.relation') }}</p>
            </div>
          </div>
          
          <div class="flex text-yellow-400 mb-4">
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
            <Icon name="mdi:star" class="text-lg" />
          </div>
          
          <blockquote class="text-gray-700 leading-relaxed">
            {{ $t('reviews.parentReviews.parents.rustam.quote') }}
          </blockquote>
          
          <div class="mt-auto pt-6 text-sm text-gray-500">
            {{ $t('reviews.parentReviews.parents.rustam.date') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
