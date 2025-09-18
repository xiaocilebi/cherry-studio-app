import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ModelIcon } from '@/components/ui/ModelIcon'
import { Text, XStack, YStack } from '@/componentsV2'
import { Message } from '@/types/message'
import { storage } from '@/utils'

interface MessageHeaderProps {
  message: Message
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ message }) => {
  const { t } = useTranslation()
  const currentLanguage = storage.getString('language')
  return (
    <View className="px-4">
      {message.model && (
        <YStack className="gap-2.5">
          <XStack className="items-center gap-1">
            <Text className="text-sm text-gray-900 dark:text-gray-100">{t(`provider.${message.model?.provider}`)}</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(message.createdAt).toLocaleTimeString(currentLanguage, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </XStack>
          <XStack className="items-center gap-1">
            <ModelIcon model={message.model} />

            <Text className="text-sm font-bold text-gray-900 dark:text-gray-100">{message.model?.name}</Text>
          </XStack>
        </YStack>
      )}
    </View>
  )
}

export default React.memo(MessageHeader)
