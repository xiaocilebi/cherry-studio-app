import { Globe, Palette, X } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { View, XStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

const logger = loggerService.withContext('ToolPreview')

interface ToolPreviewProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

const ToolPreview: React.FC<ToolPreviewProps> = ({ assistant, updateAssistant }) => {
  const handleDisableWebSearch = async () => {
    try {
      haptic(ImpactFeedbackStyle.Medium)
      updateAssistant({ ...assistant, enableWebSearch: !assistant.enableWebSearch })
    } catch (error) {
      logger.error('handleDisableWebSearch', error as Error)
    }
  }

  const handleDisableGenerateImage = async () => {
    try {
      haptic(ImpactFeedbackStyle.Medium)
      updateAssistant({ ...assistant, enableGenerateImage: !assistant.enableGenerateImage })
    } catch (error) {
      logger.error('handleDisableGenerateImage', error as Error)
    }
  }

  return (
    <View>
      <XStack>
        {assistant.model && assistant.enableGenerateImage && (
          <XStack
            gap={5}
            borderRadius={48}
            paddingVertical={4}
            paddingHorizontal={4}
            backgroundColor="$green10"
            borderWidth={0.5}
            borderColor="$green20"
            justifyContent="space-between"
            alignItems="center">
            <Palette size={20} color="$green100" />
            <X size={20} color="$green100" onPress={handleDisableGenerateImage} />
          </XStack>
        )}
        {assistant.model && assistant.enableWebSearch && (
          <XStack
            gap={5}
            borderRadius={48}
            paddingVertical={4}
            paddingHorizontal={4}
            borderWidth={0.5}
            borderColor="$green20"
            backgroundColor="$green10"
            justifyContent="space-between"
            alignItems="center">
            <Globe size={20} color="$green100" />
            <X size={20} color="$green100" onPress={handleDisableWebSearch} />
          </XStack>
        )}
      </XStack>
    </View>
  )
}

export default ToolPreview
