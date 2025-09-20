import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'

const logger = loggerService.withContext('AI Feature Handler')

interface UseAIFeatureHandlerProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  onSuccess?: () => void
}

export const useAIFeatureHandler = ({ assistant, updateAssistant, onSuccess }: UseAIFeatureHandlerProps) => {
  const handleAiFeatureChange = async (value: string) => {
    try {
      const updatedAssistant = {
        ...assistant,
        enableGenerateImage: value === 'generateImage',
        enableWebSearch: value === 'webSearch'
      }

      await updateAssistant(updatedAssistant)
      onSuccess?.()
    } catch (error) {
      logger.error('Error updating AI feature:', error)
    }
  }

  const handleEnableGenerateImage = async () => {
    const newValue = assistant.enableGenerateImage ? 'none' : 'generateImage'
    await handleAiFeatureChange(newValue)
  }

  const handleEnableWebSearch = async () => {
    const newValue = assistant.enableWebSearch ? 'none' : 'webSearch'
    await handleAiFeatureChange(newValue)
  }

  return {
    handleEnableGenerateImage,
    handleEnableWebSearch
  }
}
