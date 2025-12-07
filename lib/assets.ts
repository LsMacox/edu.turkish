/**
 * Centralized asset IDs for Directus CDN files.
 * All UUIDs reference files stored in Directus.
 */

export const ASSETS = {
  // Brand / Logo
  logo: 'c905b440-9cea-4b23-8576-f1787a84d356.png',

  // Home page
  home: {
    heroBackground: 'd837748f-0c70-4c7f-a6af-771cd41e8cfb.jpg',
    heroStudents: '8ec3658d-c21c-4843-bacf-f5ae1f830173.png',
    heroVideo: '88212a29-9f40-4c01-89d0-7a522c61b8c5.mp4',
  },

  // Blog page
  blog: {
    heroImage: '9ab6702d-df12-4b23-879a-e03b83151f1a.png',
  },

  // FAQ page
  faq: {
    heroImage: 'a87cb155-2db1-4c53-b15c-0cb8ddbe949e.png',
  },

  // Reviews page
  reviews: {
    heroImage: 'd418281e-28c7-460e-a9b7-a636922849ba.png',
  },

  // About page
  about: {
    heroBackground: '17a859b6-2e09-4e15-9dd8-b40c50a7bbd6.png',
    storyImage: '0683f4da-e558-4c40-a747-a24f0fdbc535.png',
    whoWeAreImage: 'f6893c58-7e43-4518-a403-139b942125f2.jpg',
    whyChooseUsImage: '23fe23b3-7b1b-4241-8c01-da4fa809a81a.jpg',
    team: {
      hakim: '2cfed519-b904-4dfb-acd8-94b3cb7cb5b9.jpg',
      nazrin: '4720b921-b08f-4b9b-918c-af4c95a347c0.jpg',
      adam: '7384dd3b-1f0d-496a-8a4d-caeef897c56b.jpeg',
      nargiz: '8b3b75ba-2b1f-447e-a118-6c231505b888.JPG',
    },
  },
} as const

type Assets = typeof ASSETS
