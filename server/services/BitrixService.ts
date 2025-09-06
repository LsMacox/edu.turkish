import type { ApplicationRequest } from '../types/api'
import { getBitrixApiUrl } from '../utils/bitrix-config'

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

export class BitrixService {
  private config: BitrixConfig

  constructor(config: BitrixConfig) {
    this.config = config
  }

  private async fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number; retries?: number } = {}): Promise<Response> {
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
        await new Promise(resolve => setTimeout(resolve, 1000)) // Пауза 1 секунда перед retry
        return this.fetchWithTimeout(input, { ...init, retries: retries - 1 })
      }
      
      throw error
    }
  }

  /**
   * Создание лида в Bitrix CRM
   */
  async createLead(applicationData: ApplicationRequest): Promise<{ id: number; success: boolean; error?: string }> {
    try {
      const lead = this.transformApplicationToLead(applicationData)
      
      const url = getBitrixApiUrl('crm.lead.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: lead
        }),
        timeoutMs: 20000, // Увеличиваем таймаут для создания лида
        retries: 2 // Добавляем 2 попытки retry
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        id: result.result,
        success: true
      }

    } catch (error: any) {
      console.error('Error creating Bitrix lead:', error)
      return {
        id: 0,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Получение информации о лиде
   */
  async getLead(leadId: number): Promise<any> {
    try {
      const url = getBitrixApiUrl('crm.lead.get')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId
        }),
        timeoutMs: 15000,
        retries: 1
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`)
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
      const url = getBitrixApiUrl('crm.lead.update')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
          fields
        }),
        timeoutMs: 15000,
        retries: 1
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`)
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
    // Определяем источник заявки с учетом университета
    let sourceDescription = 'Заявка с сайта EduTurkish'
    let leadTitle = `Заявка с сайта EduTurkish - ${applicationData.personal_info.first_name} ${applicationData.personal_info.last_name}`
    
    // Если есть информация о выбранном университете
    if (applicationData.preferences?.universities && applicationData.preferences.universities.length > 0) {
      const universityName = applicationData.preferences.universities[0]
      sourceDescription = `Карточка университета "${universityName}"`
      leadTitle = `Заявка - ${universityName} - ${applicationData.personal_info.first_name} ${applicationData.personal_info.last_name}`
    } else {
      // Определяем источник заявки по source
      const sourceMap: Record<string, string> = {
        'website': 'Главная страница сайта',
        'home_faq': 'Главная страница — FAQ',
        'home_questionnaire': 'Главная страница — Кто вы?',
        'universities_cta': 'Страница каталог университетов — CTA',
        'universities_not_found': 'Подходящий университет',
        'university_detail': 'Страница университета',
        'university_page': 'Страница университета',
        'university_card': 'Карточка университета',
        'modal': 'Модальное окно',
        'cta': 'Призыв к действию'
      }
      
      sourceDescription = sourceMap[applicationData.source] || 'Заявка с сайта EduTurkish'
    }
    
    const lead: BitrixLead = {
      TITLE: leadTitle,
      NAME: applicationData.personal_info.first_name,
      LAST_NAME: applicationData.personal_info.last_name,
      SOURCE_ID: 'WEB', // Источник - веб-сайт
      SOURCE_DESCRIPTION: sourceDescription
    }

    // Добавляем телефон
    if (applicationData.personal_info.phone) {
      lead.PHONE = [{
        VALUE: applicationData.personal_info.phone,
        VALUE_TYPE: 'WORK'
      }]
    }

    // Добавляем email
    if (applicationData.personal_info.email) {
      lead.EMAIL = [{
        VALUE: applicationData.personal_info.email,
        VALUE_TYPE: 'WORK'
      }]
    }

    // Комментарии с полной информацией о заявке
    const comments = []
    comments.push(`Источник заявки: ${sourceDescription}`)

    // Добавляем информацию об образовании и интересах
    if (applicationData.education) {
      // Уровень образования не передаем в Bitrix, так как он фиксированный
    }

    // Добавляем информацию о предпочтениях по университетам и программам
    if (applicationData.preferences) {
      if (applicationData.preferences.universities && applicationData.preferences.universities.length > 0) {
        comments.push(`Интересующие университеты: ${applicationData.preferences.universities.join(', ')}`)
      }
    }

    // Исключаем дублирование «Направление» и «Интересующие программы»
    // Отправляем только одно поле программ: если указаны programs — берем их, иначе берем education.field
    const explicitPrograms: string[] = Array.isArray(applicationData.preferences?.programs)
      ? (applicationData.preferences?.programs || []).filter((p) => !!p && p.trim() !== '')
      : []
    const directionField: string | undefined = (applicationData.education?.field && applicationData.education.field !== 'Не указано')
      ? applicationData.education.field
      : undefined
    const unifiedPrograms: string[] = explicitPrograms.length > 0
      ? explicitPrograms
      : (directionField ? [directionField] : [])
    if (unifiedPrograms.length > 0) {
      comments.push(`Интересующие программы: ${unifiedPrograms.join(', ')}`)
    }

    // Добавляем дополнительную информацию от пользователя
    if (applicationData.additional_info && applicationData.additional_info.trim()) {
      comments.push(`\nДополнительная информация: ${applicationData.additional_info}`)
    }

    // Добавляем предпочтения пользователя из анкеты на главной (если есть и есть данные)
    if (applicationData.user_preferences && applicationData.source === 'home_questionnaire') {
      const prefs = applicationData.user_preferences as any
      const prefLines: string[] = []
      if (prefs?.userType) {
        const userTypeMap: Record<string, string> = {
          'student': 'Студент',
          'parent': 'Родитель'
        }
        prefLines.push(`Тип пользователя: ${userTypeMap[prefs.userType] || prefs.userType}`)
      }
      if (prefs?.universityChosen) {
        prefLines.push(`Выбор университета: ${prefs.universityChosen}`)
      }
      if (prefs?.language) {
        const langMap: Record<string, string> = {
          'turkish': 'Турецкий',
          'english': 'Английский',
          'both': 'Оба языка'
        }
        prefLines.push(`Язык обучения: ${langMap[prefs.language] || prefs.language}`)
      }
      if (prefs?.scholarship) {
        const scholarshipMap: Record<string, string> = {
          'yes': 'Нужна стипендия',
          'no': 'Стипендия не нужна'
        }
        prefLines.push(`Стипендия: ${scholarshipMap[prefs.scholarship] || prefs.scholarship}`)
      }
      if (prefLines.length > 0) {
        comments.push(`\n--- Предпочтения пользователя (анкета) ---`)
        comments.push(...prefLines)
      }
    }

    if (comments.length > 0) {
      lead.COMMENTS = comments.join('\n')
    }

    // Поле источника (системный код)
    lead.UF_CRM_1234567892 = applicationData.source

    // Сохраняем только релевантные поля предпочтений из попапа
    if (applicationData.user_preferences) {
      const prefs = applicationData.user_preferences as any
      if (prefs.userType) {
        lead.UF_CRM_1234567893 = prefs.userType
      }
      if (prefs.language) {
        lead.UF_CRM_1234567894 = prefs.language
      }
    }

    // Добавляем поля образования и предпочтений
    if (applicationData.education) {
      // Уровень образования не отправляем в Bitrix
    }

    // Для поля «Направление обучения» заполняем значение без дублирования:
    // если есть явные программы — берем первую, иначе берем поле направления
    if (!lead.UF_CRM_1234567896) {
      const programsForLead: string[] = Array.isArray(applicationData.preferences?.programs)
        ? (applicationData.preferences?.programs || []).filter((p) => !!p && p.trim() !== '')
        : []
      const directionForLead: string | undefined = (applicationData.education?.field && applicationData.education.field !== 'Не указано')
        ? applicationData.education.field
        : undefined
      const chosenDirection = programsForLead.length > 0 ? programsForLead[0] : directionForLead
      if (chosenDirection) {
        lead.UF_CRM_1234567896 = chosenDirection
      }
    }

    // Добавляем интересующий университет
    if (applicationData.preferences?.universities && applicationData.preferences.universities.length > 0) {
      lead.UF_CRM_1234567897 = applicationData.preferences.universities[0]
    }

    return lead
  }

  /**
   * Превью данных лида (для тестирования)
   */
  previewLead(applicationData: ApplicationRequest): BitrixLead {
    return this.transformApplicationToLead(applicationData)
  }

  /**
   * Проверка подключения к Bitrix
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const url = getBitrixApiUrl('crm.lead.fields')

      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeoutMs: 12000,
        retries: 1
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}${text ? ` | body: ${text.slice(0, 200)}` : ''}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return { success: true }

    } catch (error: any) {
      console.error('Error testing Bitrix connection:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
