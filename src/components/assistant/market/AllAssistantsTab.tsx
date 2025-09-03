import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { YStack } from 'tamagui'

import AssistantItemCard from '@/components/assistant/AssistantItemCard'
import { Assistant } from '@/types/assistant'

interface AllAssistantsTabProps {
  assistants: Assistant[]
  onAssistantPress: (assistant: Assistant) => void
}

const AllAssistantsTab: React.FC<AllAssistantsTabProps> = ({ assistants, onAssistantPress }) => {
  const renderItem = ({ item }: { item: Assistant }) => (
    <YStack flex={1} padding={4}>
      <AssistantItemCard assistant={item} onAssistantPress={onAssistantPress} />
    </YStack>
  )

  return (
    <YStack flex={1}>
      <FlashList
        data={assistants}
        renderItem={renderItem}
        numColumns={2}
        estimatedItemSize={220}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}

export default AllAssistantsTab
