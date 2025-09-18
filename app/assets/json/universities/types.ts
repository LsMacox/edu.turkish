/**
 * Типы для описания структуры JSON университета.
 * Этот файл нужен тем, кто заполняет JSON, чтобы видеть обязательные
 * и необязательные поля, допустимые значения и формат данных.
 *
 * Базируется на примере файла `kent_university.json`.
 */

// Базовые перечисления (синхронизированы со schema.prisma)
import type { DirectionSlug } from '../../../types/directions'
import { ALL_DIRECTIONS as ALLOWED_DIRECTIONS } from '../../../types/directions'
export type UniversityType = 'state' | 'private' | 'tech' | 'elite'
export type DegreeType = 'bachelor' | 'master' | 'phd'
export type ProgramLanguage = 'tr' | 'en'
// DirectionSlug импортируется из централизованного файла
// Типы важной даты (ImportantDate.type)
export type ImportantDateType = 'deadline' | 'event' | 'exam' | 'notification'

// Внимание: структура JSON импорта не содержит массивов переводов.
// Все строки считаются переданными в одном базовом locale (см. UniversityJson.locale)

/** Диапазон стоимости обучения за год */
export interface TuitionRange {
  /** Минимальная стоимость за год (USD) */
  min?: number
  /** Максимальная стоимость за год (USD) */
  max?: number
  /** Валюта (по умолчанию: USD) */
  currency?: string
}

/** Описание блока "О университете" */
export interface AboutBlock {
  /** Краткая история, позиционирование */
  history: string
  /** Описание кампуса/миссии */
  mission: string
  /**
   * Преимущества.
   * Можно указывать либо строками, либо объектами { title, description }.
   */
  advantages: Array<string | AdvantageItem>
}

export interface AdvantageItem {
  /** Заголовок преимущества */
  title: string
  /** Краткое пояснение преимущества */
  description?: string
}

/** Сильные направления/категории с примерами программ */
export interface StrongProgramCategory {
  /** Название категории, например: "Медицина и здоровье" */
  category: string
  /** Список программ внутри категории (только названия) */
  programs: string[]
}

/** Тексты для блока "Ключевая информация" на странице университета */
export interface KeyInfoTexts {
  /** Про город */
  city_label?: string
  city_note?: string
  /** Про год основания */
  founded_year_label?: string
  founded_year_note?: string
  /** Про стоимость */
  tuition_label?: string
  tuition_note?: string
  /** Про языки обучения */
  languages_label?: string
  languages_note?: string
  /** Про общее число студентов */
  total_students_label?: string
  total_students_note?: string
  /** Про иностранных студентов */
  international_students_label?: string
  international_students_note?: string
  /** Про проживание/общежития */
  accommodation_label?: string
  accommodation_note?: string
  /** Про рейтинг (текст, не число) */
  ranking_label?: string
  ranking_text?: string
  /** Про тип университета */
  type_label?: string
  type_note?: string
}

/** Элемент медиа (галерея) — изображение или видео */
export interface MediaItem {
  /** Тип медиа */
  kind: 'image' | 'video'
  /** Ссылка на файл/ресурс */
  url: string
  /** Превью (для видео или больших изображений) */
  thumbnailUrl?: string
  /** Альтернативный текст (для изображений) */
  alt?: string
  /** Заголовок (отображаемый) */
  title?: string
  /** Подпись/описание */
  caption?: string
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    title?: string
    alt?: string
    caption?: string
  }
}

/** Инфраструктурный объект/удобство на кампусе */
export interface FacilityItem {
  /** Название объекта (например, "Main Library") */
  name: string
  /** Краткое описание */
  description?: string
  /** Необязательные поля для расширенного описания */
  image?: string
  /** Иконка/пиктограмма (если есть) */
  icon?: string
  is_active?: boolean
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    name?: string
    description?: string
  }
}

/** Требование при поступлении */
export interface RequirementItem {
  /** Категория требования: например, 'exam' | 'language' */
  category: string
  /** Название/суть требования */
  requirement: string
  /** Дополнительные детали, пояснения */
  details?: string
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    category?: string
    requirement?: string
    details?: string
  }
}

/** Документ, необходимый при поступлении */
export interface DocumentItem {
  /** Название документа на базовом языке */
  name: string
  /** Краткое описание/требования к документу */
  description?: string
  /** Ограничения по формату (например, PDF) */
  format_requirements?: string[]
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    name?: string
    description?: string
    format_requirements?: string[]
  }
}

/** Важные даты / события (ImportantDate) */
export interface ImportantDateItem {
  /** Событие (например, "Applications open") */
  event: string
  /** Дата в формате YYYY-MM-DD */
  date: string
  /** Тип события */
  type: ImportantDateType
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    event?: string
  }
}

/** Стипендии (опционально, если университет их декларирует) */
export interface ScholarshipItem {
  /** Название стипендии */
  name: string
  /** Источник: гос/университет/частная */
  type: 'government' | 'university' | 'private'
  /** Процент покрытия (0-100) */
  coverage_percentage: number
  /** Критерии отбора */
  eligibility_criteria: string[]
  /** Крайний срок подачи (если есть) */
  application_deadline?: string
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    name?: string
    eligibility_criteria?: string[]
  }
}

/** Учебная программа (используются snake_case поля как в JSON) */
export interface ProgramItem {
  /** Уровень обучения */
  degree_type: DegreeType
  /** Название программы */
  name: string
  /** Описание программы */
  description?: string
  /** Язык обучения */
  language: ProgramLanguage
  /** Стоимость за год (USD) */
  tuition_per_year: number
  /** Продолжительность обучения (в годах) */
  duration_years: number
  /** Один дополнительный перевод (опционально) */
  translation?: {
    locale: string
    name?: string
    description?: string
  }
  /**
   * Необязательная привязка программы к направлению (используется импортёром
   * для автоматического линка университета с направлением)
   */
  direction_slug?: DirectionSlug
}

/** Раздел о студенческой жизни и инфраструктуре */
export interface CampusLifeSection {
  /** Галерея медиа (изображения/видео) */
  gallery?: MediaItem[]
  /** Объекты инфраструктуры */
  facilities?: FacilityItem[]
}

/** Блок с информацией о поступлении */
export interface AdmissionSection {
  /** Требования к абитуриенту */
  requirements?: RequirementItem[]
  /** Необходимые документы */
  documents?: DocumentItem[]
  /** Ключевые даты/дедлайны */
  dates?: ImportantDateItem[]
  /** Возможные стипендии (если применимо) */
  scholarships?: ScholarshipItem[]
}

/** Отзыв (опционально; формат на усмотрение редакторов) */
export interface ReviewItem {
  author?: string
  rating?: number
  comment?: string
  date?: string
}

/**
 * Главный интерфейс JSON университета для импорта.
 * Минимально обязательные поля: title, description, slug, city, type, about, programs.
 */
export interface UniversityJson {
  /** Базовый локаль входных данных (например, 'ru', 'en', 'tr') */
  locale: string
  /** Код страны ISO Alpha-3 (например, TUR) */
  countryCode: string
  /** Название страны (опционально, будет сохранено как перевод страны для locale) */
  countryName?: string
  /** Название университета для отображения */
  title: string
  /** Описание (короткий абзац) */
  description: string
  /** Уникальный слаг (используется в URL) */
  slug: string
  /** Город расположения (название на выбранном locale) */
  city: string
  /** Год основания (если важен) */
  foundedYear?: number
  /** Тип университета */
  type: UniversityType
  /** Диапазон стоимости обучения за год */
  tuitionRange?: TuitionRange
  /** Рейтинг (опционально) */
  rankingScore?: number
  /** Общее число студентов (если известно) */
  totalStudents?: number
  /** Число иностранных студентов (если известно) */
  internationalStudents?: number
  /** Есть ли общежития/проживание */
  hasAccommodation?: boolean
  /** Предоставляются ли стипендии (флаг для быстрых фильтров) */
  hasScholarships?: boolean
  /** Главное изображение (герой) */
  heroImage?: string
  /** Дополнительное изображение/превью */
  image?: string

  /** Блок "О университете" */
  about: AboutBlock

  /** Сильные направления обучения (категории) */
  strong_programs?: StrongProgramCategory[]

  /** Тексты для ключевой информации (свободная структура) */
  key_info_texts?: KeyInfoTexts

  /** Кампус и студенческая жизнь */
  campus_life?: CampusLifeSection

  /** Раздел о поступлении */
  admission?: AdmissionSection

  /** Отзывы (опционально) */
  reviews?: ReviewItem[]

  /** Перечень учебных программ (обязателен, даже если 1-2 позиции) */
  programs: ProgramItem[]
  /**
   * Необязательный список направлений, к которым относится университет.
   * Если не указано, импортёр попытается собрать направления из programs[].direction_slug
   */
  directions?: DirectionSlug[]
}

/** Полезные константы для валидации/подсказок редакторам */
export const ALLOWED_UNIVERSITY_TYPES: UniversityType[] = ['state', 'private', 'tech', 'elite']
export const ALLOWED_DEGREE_TYPES: DegreeType[] = ['bachelor', 'master', 'phd']
export const ALLOWED_PROGRAM_LANGUAGES: ProgramLanguage[] = ['tr', 'en']
export const ALLOWED_IMPORTANT_DATE_TYPES: ImportantDateType[] = ['deadline', 'event', 'exam', 'notification']
export { ALLOWED_DIRECTIONS }


