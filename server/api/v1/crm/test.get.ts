import { CRMFactory } from '~~/server/services/crm/CRMFactory'

export default defineEventHandler(async (event) => {
  try {
    // Get the current CRM provider
    const provider = CRMFactory.getCurrentProvider()
    const crmService = CRMFactory.createFromEnv()

    // Test the connection
    const isConnected = await crmService.testConnection()

    return {
      success: true,
      provider: provider,
      providerName: crmService.providerName,
      connected: isConnected,
      message: `Connection to ${provider} successful`,
    }
  } catch (error: any) {
    console.error('CRM test connection failed:', error)
    
    return {
      success: false,
      provider: CRMFactory.getCurrentProvider(),
      connected: false,
      error: error.message,
      message: 'Connection test failed',
    }
  }
})
