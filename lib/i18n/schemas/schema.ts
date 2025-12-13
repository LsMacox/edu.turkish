/**
 * Complete I18n Schema type
 * Separated to avoid circular dependencies
 */

import type { CommonSchema } from './common'
import type { ComponentsSchema } from './components'
import type { HomeSchema } from './home'
import type { AboutSchema } from './about'
import type { UniversitiesSchema } from './universities'
import type { BlogSchema } from './blog'
import type { ProgramsSchema } from './programs'
import type { ReviewsSchema } from './reviews'
import type { ServicesSchema } from './services'
import type { FaqSchema } from './faq'
import type { ContractSchema } from './contract'
import type { PrivacySchema } from './privacy'

/**
 * Complete i18n schema - flat union of all translation files.
 * Keys are merged at the top level for backward compatibility.
 */
export interface I18nSchema
    extends CommonSchema,
        ComponentsSchema {
    home: HomeSchema
    about: AboutSchema
    universities: UniversitiesSchema
    blog: BlogSchema
    programs: ProgramsSchema
    reviews: ReviewsSchema
    services: ServicesSchema
    faq: FaqSchema
    contract: ContractSchema
    privacy: PrivacySchema
}
