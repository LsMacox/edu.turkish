import { BitrixService } from '../../../services/BitrixService'
import type { ApplicationRequest } from '../../../types/api'

export default defineEventHandler(async (event) => {
  try {
    // Read request body
    const body = await readBody(event) as ApplicationRequest
    
    // Create BitrixService instance with dummy config for preview
    const bitrixService = new BitrixService({
      domain: 'preview.bitrix24.ru',
      accessToken: 'preview_token'
    })
    
    // Get the lead data that would be sent to Bitrix (without actually sending)
    const leadData = bitrixService.previewLead(body)
    
    return {
      success: true,
      leadData,
      summary: {
        title: leadData.TITLE,
        source: leadData.SOURCE_DESCRIPTION,
        userPreferences: body.user_preferences ? 'Есть данные анкеты' : 'Нет данных анкеты',
        hasPhone: !!(leadData.PHONE && leadData.PHONE.length),
        hasEmail: !!(leadData.EMAIL && leadData.EMAIL.length),
        customFields: {
          sourceCode: leadData.UF_CRM_1234567892,
          userType: leadData.UF_CRM_1234567893,
          language: leadData.UF_CRM_1234567894
        }
      }
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})
