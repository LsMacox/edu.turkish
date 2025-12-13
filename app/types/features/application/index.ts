export interface ApplicationPreferences {
  source: string
  description: string

  // Optional context
  universityName?: string

  // Questionnaire fields (from home page)
  userType?: 'student' | 'parent'
  universityChosen?: string
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
}
