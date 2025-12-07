import { prisma } from '~~/lib/prisma'
import { UniversityRepository } from './UniversityRepository'
import { DirectionRepository } from './DirectionRepository'
import { BlogRepository } from './BlogRepository'
import { FAQRepository } from './FAQRepository'
import { ExchangeRateRepository } from './ExchangeRateRepository'
import { ApplicationRepository } from './ApplicationRepository'
import { ReviewRepository } from './ReviewRepository'
import { StatisticsRepository } from './StatisticsRepository'

// Singleton instances
const repos = {
  university: null as UniversityRepository | null,
  direction: null as DirectionRepository | null,
  blog: null as BlogRepository | null,
  faq: null as FAQRepository | null,
  exchangeRate: null as ExchangeRateRepository | null,
  application: null as ApplicationRepository | null,
  review: null as ReviewRepository | null,
  statistics: null as StatisticsRepository | null,
}

export function getUniversityRepository(): UniversityRepository {
  return (repos.university ??= new UniversityRepository(prisma))
}

export function getDirectionRepository(): DirectionRepository {
  return (repos.direction ??= new DirectionRepository(prisma))
}

export function getBlogRepository(): BlogRepository {
  return (repos.blog ??= new BlogRepository(prisma))
}

export function getFAQRepository(): FAQRepository {
  return (repos.faq ??= new FAQRepository(prisma))
}

export function getExchangeRateRepository(): ExchangeRateRepository {
  return (repos.exchangeRate ??= new ExchangeRateRepository(prisma))
}

export function getApplicationRepository(): ApplicationRepository {
  return (repos.application ??= new ApplicationRepository(prisma))
}

export function getReviewRepository(): ReviewRepository {
  return (repos.review ??= new ReviewRepository(prisma))
}

export function getStatisticsRepository(): StatisticsRepository {
  return (repos.statistics ??= new StatisticsRepository(prisma))
}
