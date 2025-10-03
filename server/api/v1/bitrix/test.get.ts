import { BitrixService } from '~~/server/services/BitrixService'
import { getBitrixConfig, validateBitrixConfig } from '~~/server/utils/bitrix-config'

export default defineEventHandler(async (_event) => {
  try {
    // Проверяем настройки Bitrix
    if (!validateBitrixConfig()) {
      return {
        success: false,
        error: 'Bitrix configuration is missing or invalid',
      }
    }

    // Получаем конфигурацию и создаем сервис
    const bitrixConfig = getBitrixConfig()
    const bitrixService = new BitrixService(bitrixConfig)

    // Тестируем соединение
    const testResult = await bitrixService.testConnection()

    return {
      success: testResult.success,
      error: testResult.error,
      config: {
        domain: bitrixConfig.domain,
        hasToken: !!bitrixConfig.accessToken,
        hasWebhook: !!bitrixConfig.webhookUrl,
      },
    }
  } catch (error: any) {
    console.error('Error testing Bitrix connection:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})
