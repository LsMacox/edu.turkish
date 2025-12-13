import type { NuxtConfig } from 'nuxt/schema'

/**
 * Static component auto-import configuration
 * Feature directories are registered with their PascalCase prefix
 *
 * Structure based on actual app/components/features/ layout:
 * - about/: ContactInfo.vue, sections/
 * - blog/: Article.vue, PowerPage.vue, cards/, content/, sections/, widgets/
 * - home/: sections/
 * - programs/: Detail.vue
 * - reviews/: Card.vue, LightboxModal.vue, ShareExperienceForm.vue, sections/
 * - services/: multiple .vue files, sections/
 * - universities/: detail/, list/
 */
export const componentsConfig: NuxtConfig['components'] = [
  // Layout components - globally available
  {
    path: '~/components/layout',
    global: true,
  },

  // Feature: About
  {
    path: '~/components/features/about',
    prefix: 'About',
    pathPrefix: false,
  },
  {
    path: '~/components/features/about/sections',
    prefix: 'About',
    pathPrefix: false,
  },

  // Feature: Blog
  {
    path: '~/components/features/blog',
    prefix: 'Blog',
    pathPrefix: false,
  },
  {
    path: '~/components/features/blog/cards',
    prefix: 'Blog',
    pathPrefix: false,
  },
  {
    path: '~/components/features/blog/content',
    prefix: 'Blog',
    pathPrefix: false,
  },
  {
    path: '~/components/features/blog/sections',
    prefix: 'Blog',
    pathPrefix: false,
  },
  {
    path: '~/components/features/blog/widgets',
    prefix: 'Blog',
    pathPrefix: false,
    global: true, // Widgets need global registration for dynamic resolution
  },

  // Feature: Home
  {
    path: '~/components/features/home/sections',
    prefix: 'Home',
    pathPrefix: false,
  },

  // Feature: Programs
  {
    path: '~/components/features/programs',
    prefix: 'Programs',
    pathPrefix: false,
  },

  // Feature: Reviews
  {
    path: '~/components/features/reviews',
    prefix: 'Reviews',
    pathPrefix: false,
  },
  {
    path: '~/components/features/reviews/sections',
    prefix: 'Reviews',
    pathPrefix: false,
  },

  // Feature: Services
  {
    path: '~/components/features/services',
    prefix: 'Services',
    pathPrefix: false,
  },
  {
    path: '~/components/features/services/sections',
    prefix: 'Services',
    pathPrefix: false,
  },

  // Feature: Universities
  {
    path: '~/components/features/universities/detail',
    prefix: 'Universities',
    pathPrefix: false,
  },
  {
    path: '~/components/features/universities/list',
    prefix: 'Universities',
    pathPrefix: false,
  },

  // UI components with Ui prefix
  {
    path: '~/components/ui',
    prefix: 'Ui',
  },

  // Shared components - globally available
  {
    path: '~/components/shared',
    global: true,
    pathPrefix: false,
  },
]
