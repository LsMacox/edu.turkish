import type { PrismaClient } from '@prisma/client'
import { prisma } from '~~/lib/infrastructure/prisma'
import { UniversityRepository } from './UniversityRepository'
import { DirectionRepository } from './DirectionRepository'
import { BlogRepository } from './BlogRepository'
import { FAQRepository } from './FAQRepository'
import { ExchangeRateRepository } from './ExchangeRateRepository'
import { ApplicationRepository } from './ApplicationRepository'
import { ReviewRepository } from './ReviewRepository'
import { StatisticsRepository } from './StatisticsRepository'

type RepositoryConstructor<T> = new (prisma: PrismaClient) => T

const instances = new Map<RepositoryConstructor<unknown>, unknown>()

function getRepository<T>(Ctor: RepositoryConstructor<T>): T {
  let instance = instances.get(Ctor) as T | undefined
  if (!instance) {
    instance = new Ctor(prisma)
    instances.set(Ctor, instance)
  }
  return instance
}

export const getUniversityRepository = () => getRepository(UniversityRepository)
export const getDirectionRepository = () => getRepository(DirectionRepository)
export const getBlogRepository = () => getRepository(BlogRepository)
export const getFAQRepository = () => getRepository(FAQRepository)
export const getExchangeRateRepository = () => getRepository(ExchangeRateRepository)
export const getApplicationRepository = () => getRepository(ApplicationRepository)
export const getReviewRepository = () => getRepository(ReviewRepository)
export const getStatisticsRepository = () => getRepository(StatisticsRepository)
