import { describe, expect, it } from 'vitest'

import type { ApplicationRequest } from '../../../server/types/api'
import { BitrixService } from '../../../server/services/BitrixService'

const createService = () => new BitrixService({ domain: 'example.com', accessToken: 'token' })

const createApplication = (overrides: Partial<ApplicationRequest> = {}): ApplicationRequest => ({
  personal_info: {
    first_name: 'Иван',
    last_name: 'Иванов',
    email: 'ivan@example.com',
    phone: '+79991234567',
    country: 'Россия',
    city: 'Москва',
    birth_date: '2000-01-01',
    ...overrides.personal_info,
  },
  education: {
    level: 'bachelor',
    field: 'Информатика',
    ...overrides.education,
  },
  preferences: {
    universities: ['Университет Анкары'],
    programs: ['Программирование'],
    budget: '5000$',
    start_date: '2025-09-01',
    scholarship_needed: true,
    language_preference: 'turkish',
    ...overrides.preferences,
  },
  additional_info: overrides.additional_info ?? 'Нужен кампус в центре',
  source: overrides.source ?? 'website',
  user_preferences: overrides.user_preferences,
  referral_code: overrides.referral_code,
})

describe('BitrixService helper methods', () => {
  describe('prepareLeadHeaderAndSource', () => {
    it('prioritizes selected university in title and source description', () => {
      const service = createService()
      const application = createApplication({
        preferences: { universities: ['Босфор Университи'] },
      })

      const result = (service as any).prepareLeadHeaderAndSource(application)

      expect(result.title).toContain('Босфор Университи')
      expect(result.sourceDescription).toBe('Карточка университета "Босфор Университи"')
    })

    it('uses source map when university is not provided', () => {
      const service = createService()
      const application = createApplication({
        preferences: { universities: [] },
        source: 'home_questionnaire',
      })

      const result = (service as any).prepareLeadHeaderAndSource(application)

      expect(result.title).toBe('Заявка с сайта EduTurkish - Иван Иванов')
      expect(result.sourceDescription).toBe('Главная страница — Кто вы?')
    })
  })

  describe('collectContactData', () => {
    it('returns phone and email when provided', () => {
      const service = createService()
      const application = createApplication()

      const contact = (service as any).collectContactData(application)

      expect(contact.PHONE?.[0]).toEqual({ VALUE: '+79991234567', VALUE_TYPE: 'WORK' })
      expect(contact.EMAIL?.[0]).toEqual({ VALUE: 'ivan@example.com', VALUE_TYPE: 'WORK' })
    })

    it('omits empty contact fields', () => {
      const service = createService()
      const application = createApplication({
        personal_info: { phone: '', email: '' },
      })

      const contact = (service as any).collectContactData(application)

      expect(contact).toEqual({})
    })
  })

  describe('generateLeadComments', () => {
    it('includes explicit programs, university and referral details', () => {
      const service = createService()
      const application = createApplication({
        referral_code: 'ref-123',
        additional_info: 'Интересует стипендия',
        preferences: {
          universities: ['Университет Анкары', 'METU'],
          programs: ['Программирование', 'Математика'],
        },
      })

      const comments: string = (service as any).generateLeadComments(
        application,
        'Главная страница сайта',
      )

      expect(comments).toContain('Источник заявки: Главная страница сайта')
      expect(comments).toContain('Реферальный код: ref-123')
      expect(comments).toContain('Интересующие университеты: Университет Анкары, METU')
      expect(comments).toContain('Интересующие программы: Программирование, Математика')
      expect(comments).toContain('Дополнительная информация: Интересует стипендия')
    })

    it('adds questionnaire preferences and falls back to education field for programs', () => {
      const service = createService()
      const application = createApplication({
        preferences: { universities: [], programs: [] },
        education: { level: 'master', field: 'Медицина' },
        source: 'home_questionnaire',
        user_preferences: {
          userType: 'parent',
          universityChosen: 'yes',
          language: 'both',
          scholarship: 'yes',
        },
      })

      const comments: string = (service as any).generateLeadComments(
        application,
        'Главная страница — Кто вы?',
      )

      expect(comments).toContain('Интересующие программы: Медицина')
      expect(comments).toContain('--- Предпочтения пользователя (анкета) ---')
      expect(comments).toContain('Тип пользователя: Родитель')
      expect(comments).toContain('Выбор университета: yes')
      expect(comments).toContain('Язык обучения: Оба языка')
      expect(comments).toContain('Стипендия: Нужна стипендия')
    })
  })

  describe('buildCustomFields', () => {
    it('populates custom fields from programs and user preferences', () => {
      const service = createService()
      const application = createApplication({
        referral_code: 'ref-456',
        user_preferences: {
          userType: 'student',
          language: 'english',
        },
      })

      const customFields = (service as any).buildCustomFields(application)

      expect(customFields).toMatchObject({
        UF_CRM_1234567892: 'website',
        UF_CRM_REFERRAL_CODE: 'ref-456',
        UF_CRM_1234567893: 'student',
        UF_CRM_1234567894: 'english',
        UF_CRM_1234567896: 'Программирование',
        UF_CRM_1234567897: 'Университет Анкары',
      })
    })

    it('uses education field when programs are empty and no referral code', () => {
      const service = createService()
      const application = createApplication({
        preferences: { universities: ['Istanbul University'], programs: [] },
        education: { level: 'master', field: 'Медицина' },
        referral_code: undefined,
      })

      const customFields = (service as any).buildCustomFields(application)

      expect(customFields.UF_CRM_REFERRAL_CODE).toBeUndefined()
      expect(customFields.UF_CRM_1234567896).toBe('Медицина')
      expect(customFields.UF_CRM_1234567897).toBe('Istanbul University')
    })
  })
})
