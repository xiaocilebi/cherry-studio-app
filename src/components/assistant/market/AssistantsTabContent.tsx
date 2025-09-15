import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'

import AssistantItemCard from '@/components/assistant/AssistantItemCard'
import { Assistant } from '@/types/assistant'

interface AssistantsTabProps {
  assistants: Assistant[]
  onAssistantPress: (assistant: Assistant) => void
  numColumns?: number
  estimatedItemSize?: number
}

const AssistantsTabContent: React.FC<AssistantsTabProps> = ({
  assistants,
  onAssistantPress,
  numColumns = 2,
  estimatedItemSize = 230
}) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const renderItem = ({ item }: { item: Assistant }) => (
    <AssistantItemCard assistant={item} onAssistantPress={onAssistantPress} />
  )

  if (!assistants || assistants.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Text color="$color10" fontSize={16}>
          {t('assistants.market.empty_state')}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1}>
      <FlashList
        data={assistants}
        renderItem={renderItem}
        numColumns={numColumns}
        estimatedItemSize={estimatedItemSize}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        drawDistance={200}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </YStack>
  )
}

export default AssistantsTabContent
