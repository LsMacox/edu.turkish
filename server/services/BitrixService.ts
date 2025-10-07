import type { ApplicationRequest, UserPreferencesDTO } from '~~/server/types/api'
import { parsePositiveInt } from '~~/lib/number'
import {
  messengerEventPayloadSchema,
  type MessengerEventMetadata,
  type MessengerEventPayload,
  type SanitizedMessengerEventPayload,
} from './bitrix.dto'
import { hasUtmValues } from '~~/server/utils/utm'

export interface BitrixLead {
  TITLE: string
  NAME: string
  LAST_NAME?: string
  SECOND_NAME?: string
  PHONE?: { VALUE: string; VALUE_TYPE: string }[]
  EMAIL?: { VALUE: string; VALUE_TYPE: string }[]
  COMMENTS?: string
  SOURCE_ID?: string
  SOURCE_DESCRIPTION?: string
  UF_CRM_1234567892?: string // Источник заявки (только системный код источника)
  UF_CRM_REFERRAL_CODE?: string // Реферальный код партнера
  // Ниже — поля для предпочтений пользователя из попапа на главной
  UF_CRM_1234567893?: string // Тип пользователя (student|parent)
  UF_CRM_1234567894?: string // Язык обучения (turkish|english|both)
  // Добавляем поля для образования и предпочтений (без уровня образования — он фиксированный и не передается)
  UF_CRM_1234567896?: string // Направление обучения
  UF_CRM_1234567897?: string // Интересующий университет
}

export interface BitrixConfig {
  domain: string
  accessToken: string
  webhookUrl?: string
}

export interface BitrixActivityConfig {
  ownerId?: number
  ownerTypeId?: number
  responsibleId?: number
}

interface BitrixActivityCommunication {
  TYPE: 'IM'
  VALUE: string
}

interface BitrixActivityFields {
  SUBJECT: string
  DESCRIPTION: string
  TYPE_ID: number
  COMPLETED: 'N' | 'Y'
  START_TIME: string
  END_TIME: string
  COMMUNICATIONS: BitrixActivityCommunication[]
  OWNER_ID?: number
  OWNER_TYPE_ID?: number
  RESPONSIBLE_ID?: number
}

const hasMetadataValues = (
  metadata?: MessengerEventMetadata,
): metadata is MessengerEventMetadata => {
  if (!metadata) {
    return false
  }

  return Boolean(
    metadata.page ||
      metadata.section ||
      metadata.component ||
      metadata.campaign ||
      metadata.referrer ||
      metadata.notes,
  )
}

// use parsePositiveInt from shared number utils

export class BitrixService {
  private config: BitrixConfig

  constructor(config: BitrixConfig) {
    this.config = config
  }

  /**
   * Build Bitrix API URL for a given method
   */
  private getBitrixApiUrl(method: string): string {
    const { webhookUrl } = this.config
    if (webhookUrl) {
      const trimmed = webhookUrl.replace(/\/$/, '')
      return `${trimmed}/${method}.json`
    }
    throw new Error('Bitrix webhookUrl is required')
  }

  /**
   * Get Bitrix activity configuration from environment variables
   */
  private getBitrixActivityConfig(): BitrixActivityConfig {
    return {
      ownerId: parsePositiveInt(process.env.BITRIX_ACTIVITY_OWNER_ID),
      ownerTypeId: parsePositiveInt(process.env.BITRIX_ACTIVITY_OWNER_TYPE_ID),
      responsibleId: parsePositiveInt(process.env.BITRIX_ACTIVITY_RESPONSIBLE_ID),
    }
  }

  private async fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number; retries?: number } = {},
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutMs = init.timeoutMs ?? 15000 // Увеличиваем дефолтный таймаут до 15 секунд
    const retries = init.retries ?? 0

    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      clearTimeout(timeout)
      return response
    } catch (error: any) {
      clearTimeout(timeout)

      // Если это abort error и есть попытки retry, пробуем еще раз
      if ((error.name === 'AbortError' || error.message?.includes('aborted')) && retries > 0) {
        console.warn(`Bitrix request aborted, retrying... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Пауза 1 секунда перед retry
        return this.fetchWithTimeout(input, { ...init, retries: retries - 1 })
      }

      throw error
    }
  }

  /**
   * Создание лида в Bitrix CRM
   */
  async createLead(
    applicationData: ApplicationRequest,
  ): Promise<{ id: number; success: boolean; error?: string }> {
    try {
      const lead = this.transformApplicationToLead(applicationData)

      const url = this.getBitrixApiUrl('crm.lead.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: lead,
        }),
        timeoutMs: 20000, // Увеличиваем таймаут для создания лида
        retries: 2, // Добавляем 2 попытки retry
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`,
        )
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        id: result.result,
        success: true,
      }
    } catch (error: any) {
      console.error('Error creating Bitrix lead:', error)
      return {
        id: 0,
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Создание минимального лида из события мессенджера
   */
  async createMinimalLeadFromEvent(
    payload: MessengerEventPayload,
  ): Promise<{ id: number; success: boolean; error?: string }> {
    try {
      const validationResult = messengerEventPayloadSchema.safeParse(payload)

      if (!validationResult.success) {
        console.error(
          'Invalid messenger event payload for minimal lead creation:',
          validationResult.error.flatten(),
        )
        return {
          id: 0,
          success: false,
          error: 'Invalid messenger event payload',
        }
      }

      const sanitizedPayload: SanitizedMessengerEventPayload = validationResult.data
      const metadata = hasMetadataValues(sanitizedPayload.metadata)
        ? sanitizedPayload.metadata
        : undefined
      const utm = hasUtmValues(sanitizedPayload.utm) ? sanitizedPayload.utm : undefined
      const session = sanitizedPayload.session ?? undefined

      const lead: BitrixLead = {
        TITLE: `Lead from ${sanitizedPayload.channel} click`,
        NAME: 'Lead',
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: `Referral: ${sanitizedPayload.referralCode}`,
        COMMENTS: JSON.stringify({ utm, session, metadata }),
        UF_CRM_REFERRAL_CODE: sanitizedPayload.referralCode,
      }

      const url = this.getBitrixApiUrl('crm.lead.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: lead,
        }),
        timeoutMs: 15000,
        retries: 1,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`,
        )
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        id: result.result,
        success: true,
      }
    } catch (error: any) {
      console.error('Error creating minimal lead from event:', error)
      return {
        id: 0,
        success: false,
        error: error.message,
      }
    }
  }

  async logMessengerEvent(
    payload: MessengerEventPayload,
  ): Promise<{ success: boolean; activityId?: number; error?: string }> {
    try {
      const validationResult = messengerEventPayloadSchema.safeParse(payload)

      if (!validationResult.success) {
        console.error(
          'Invalid messenger event payload for Bitrix:',
          validationResult.error.flatten(),
        )
        return {
          success: false,
          error: 'Invalid messenger event payload',
        }
      }

      const sanitizedPayload: SanitizedMessengerEventPayload = validationResult.data
      const metadata = hasMetadataValues(sanitizedPayload.metadata)
        ? sanitizedPayload.metadata
        : undefined
      const utm = hasUtmValues(sanitizedPayload.utm) ? sanitizedPayload.utm : undefined
      const session = sanitizedPayload.session ?? undefined

      const url = this.getBitrixApiUrl('crm.activity.add')

      const descriptionLines = [
        `Channel: ${sanitizedPayload.channel}`,
        `Referral: ${sanitizedPayload.referralCode}`,
      ]

      if (session) {
        descriptionLines.push(`Session: ${session}`)
      }

      if (utm) {
        descriptionLines.push(`UTM: ${JSON.stringify(utm)}`)
      }

      if (metadata) {
        descriptionLines.push(`Metadata: ${JSON.stringify(metadata)}`)
      }

      const now = new Date().toISOString()

      const fields: BitrixActivityFields = {
        SUBJECT: `Messenger click: ${sanitizedPayload.channel}`,
        DESCRIPTION: descriptionLines.join('\n'),
        TYPE_ID: 4,
        COMPLETED: 'N',
        START_TIME: now,
        END_TIME: now,
        COMMUNICATIONS: [
          {
            TYPE: 'IM',
            VALUE: sanitizedPayload.channel,
          },
        ],
      }

      const activityConfig = this.getBitrixActivityConfig()

      if (activityConfig.ownerId) {
        fields.OWNER_ID = activityConfig.ownerId
      }

      if (activityConfig.ownerTypeId) {
        fields.OWNER_TYPE_ID = activityConfig.ownerTypeId
      }

      if (activityConfig.responsibleId) {
        fields.RESPONSIBLE_ID = activityConfig.responsibleId
      }

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
        timeoutMs: 10000,
        retries: 1,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`,
        )
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        success: true,
        activityId: result.result,
      }
    } catch (error: any) {
      console.error('Error logging messenger event in Bitrix:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Получение информации о лиде
   */
  async getLead(leadId: number): Promise<any> {
    try {
      const url = this.getBitrixApiUrl('crm.lead.get')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
        }),
        timeoutMs: 15000,
        retries: 1,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`,
        )
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return result.result
    } catch (error: any) {
      console.error('Error getting Bitrix lead:', error)
      throw error
    }
  }

  /**
   * Обновление лида
   */
  async updateLead(leadId: number, fields: Partial<BitrixLead>): Promise<boolean> {
    try {
      const url = this.getBitrixApiUrl('crm.lead.update')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
          fields,
        }),
        timeoutMs: 15000,
        retries: 1,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          `HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`,
        )
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return result.result
    } catch (error: any) {
      console.error('Error updating Bitrix lead:', error)
      return false
    }
  }

  /**
   * Преобразование данных заявки в формат лида Bitrix
   */
  private transformApplicationToLead(applicationData: ApplicationRequest): BitrixLead {
    const { title, sourceDescription } = this.prepareLeadHeaderAndSource(applicationData)
    const contactFields = this.collectContactData(applicationData)
    const comments = this.generateLeadComments(applicationData, sourceDescription)
    const customFields = this.buildCustomFields(applicationData)

    const lead: BitrixLead = {
      TITLE: title,
      NAME: applicationData.personal_info.first_name,
      LAST_NAME: applicationData.personal_info.last_name,
      SOURCE_ID: 'WEB', // Источник - веб-сайт
      SOURCE_DESCRIPTION: sourceDescription,
      ...contactFields,
      ...customFields,
    }

    if (comments) {
      lead.COMMENTS = comments
    }

    return lead
  }

  private prepareLeadHeaderAndSource(applicationData: ApplicationRequest): {
    title: string
    sourceDescription: string
  } {
    let sourceDescription = 'Заявка с сайта EduTurkish'
    let leadTitle = `Заявка с сайта EduTurkish - ${applicationData.personal_info.first_name} ${applicationData.personal_info.last_name}`

    if (
      applicationData.preferences?.universities &&
      applicationData.preferences.universities.length > 0
    ) {
      const universityName = applicationData.preferences.universities[0]
      sourceDescription = `Карточка университета "${universityName}"`
      leadTitle = `Заявка - ${universityName} - ${applicationData.personal_info.first_name} ${applicationData.personal_info.last_name}`
    } else {
      const sourceMap: Record<string, string> = {
        website: 'Главная страница сайта',
        home_faq: 'Главная страница — FAQ',
        home_questionnaire: 'Главная страница — Кто вы?',
        universities_cta: 'Страница каталог университетов — CTA',
        universities_not_found: 'Подходящий университет',
        university_detail: 'Страница университета',
        university_page: 'Страница университета',
        university_card: 'Карточка университета',
        modal: 'Модальное окно',
        cta: 'Призыв к действию',
      }

      sourceDescription = sourceMap[applicationData.source] || 'Заявка с сайта EduTurkish'
    }

    return { title: leadTitle, sourceDescription }
  }

  private collectContactData(
    applicationData: ApplicationRequest,
  ): Partial<Pick<BitrixLead, 'PHONE' | 'EMAIL'>> {
    const contactFields: Partial<Pick<BitrixLead, 'PHONE' | 'EMAIL'>> = {}

    if (applicationData.personal_info.phone) {
      contactFields.PHONE = [
        {
          VALUE: applicationData.personal_info.phone,
          VALUE_TYPE: 'WORK',
        },
      ]
    }

    if (applicationData.personal_info.email) {
      contactFields.EMAIL = [
        {
          VALUE: applicationData.personal_info.email,
          VALUE_TYPE: 'WORK',
        },
      ]
    }

    return contactFields
  }

  private generateLeadComments(
    applicationData: ApplicationRequest,
    sourceDescription: string,
  ): string | undefined {
    const comments: string[] = [`Источник заявки: ${sourceDescription}`]

    if (applicationData.referral_code) {
      comments.push(`Реферальный код: ${applicationData.referral_code}`)
    }

    if (
      applicationData.preferences?.universities &&
      applicationData.preferences.universities.length > 0
    ) {
      comments.push(
        `Интересующие университеты: ${applicationData.preferences.universities.join(', ')}`,
      )
    }

    const explicitPrograms: string[] = Array.isArray(applicationData.preferences?.programs)
      ? (applicationData.preferences?.programs || []).filter((p) => !!p && p.trim() !== '')
      : []
    if (explicitPrograms.length > 0) {
      comments.push(`Интересующие программы: ${explicitPrograms.join(', ')}`)
    }

    if (applicationData.additional_info && applicationData.additional_info.trim()) {
      comments.push(`\nДополнительная информация: ${applicationData.additional_info}`)
    }

    if (applicationData.user_preferences && applicationData.source === 'home_questionnaire') {
      const prefs = applicationData.user_preferences
      const prefLines: string[] = []
      if (prefs?.userType) {
        const userTypeMap: Record<NonNullable<UserPreferencesDTO['userType']>, string> = {
          student: 'Студент',
          parent: 'Родитель',
        }
        prefLines.push(`Тип пользователя: ${userTypeMap[prefs.userType]}`)
      }
      if (prefs?.universityChosen) {
        prefLines.push(`Выбор университета: ${prefs.universityChosen}`)
      }
      if (prefs?.language) {
        const langMap: Record<NonNullable<UserPreferencesDTO['language']>, string> = {
          turkish: 'Турецкий',
          english: 'Английский',
          both: 'Оба языка',
        }
        prefLines.push(`Язык обучения: ${langMap[prefs.language]}`)
      }
      if (prefs?.scholarship) {
        const scholarshipMap: Record<NonNullable<UserPreferencesDTO['scholarship']>, string> = {
          yes: 'Нужна стипендия',
          no: 'Стипендия не нужна',
        }
        prefLines.push(`Стипендия: ${scholarshipMap[prefs.scholarship]}`)
      }
      if (prefLines.length > 0) {
        comments.push(`\n--- Предпочтения пользователя (анкета) ---`)
        comments.push(...prefLines)
      }
    }

    if (comments.length === 0) {
      return undefined
    }

    return comments.join('\n')
  }

  private buildCustomFields(applicationData: ApplicationRequest): Partial<BitrixLead> {
    const customFields: Partial<BitrixLead> = {
      UF_CRM_1234567892: applicationData.source,
    }

    if (applicationData.referral_code) {
      customFields.UF_CRM_REFERRAL_CODE = applicationData.referral_code
    }

    if (applicationData.user_preferences) {
      const prefs = applicationData.user_preferences
      if (prefs.userType) {
        customFields.UF_CRM_1234567893 = prefs.userType
      }
      if (prefs.language) {
        customFields.UF_CRM_1234567894 = prefs.language
      }
    }

    const programsForLead: string[] = Array.isArray(applicationData.preferences?.programs)
      ? (applicationData.preferences?.programs || []).filter((p) => !!p && p.trim() !== '')
      : []
    if (programsForLead.length > 0) {
      customFields.UF_CRM_1234567896 = programsForLead[0]
    }

    if (
      applicationData.preferences?.universities &&
      applicationData.preferences.universities.length > 0
    ) {
      customFields.UF_CRM_1234567897 = applicationData.preferences.universities[0]
    }

    return customFields
  }
}
