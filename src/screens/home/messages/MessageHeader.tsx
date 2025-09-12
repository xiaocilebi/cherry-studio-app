import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View, XStack, YStack } from 'tamagui'

import { ModelIcon } from '@/components/ui/ModelIcon'
import { Message } from '@/types/message'
import { storage } from '@/utils'

interface MessageHeaderProps {
  message: Message
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ message }) => {
  const { t } = useTranslation()
  const currentLanguage = storage.getString('language')
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {message.model && (
        <YStack gap={10}>
          <XStack alignItems="center" gap={4}>
            <Text>{t(`provider.${message.model?.provider}`)}</Text>
            <Text fontSize={10}>
              {new Date(message.createdAt).toLocaleTimeString(currentLanguage, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <ModelIcon model={message.model} />

            <Text fontSize={14} fontWeight="bold">
              {message.model?.name}
            </Text>
          </XStack>
        </YStack>
      )}
    </View>
  )
}

export default React.memo(MessageHeader)
