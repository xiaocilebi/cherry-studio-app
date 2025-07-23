import MaskedView from '@react-native-masked-view/masked-view'
import { FlashList } from '@shopify/flash-list'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import React from 'react'
import { ScrollView, Text, XStack, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import AssistantItemCard from '@/components/assistant/AssistantItemCard'
import { Assistant } from '@/types/assistant'

interface AllAssistantsTabProps {
  assistantGroups: Record<string, Assistant[]>
  onArrowClick: (groupKey: string) => void
  onAssistantPress: (assistant: Assistant) => void
}

interface GroupItem {
  type: 'group'
  groupKey: string
  assistants: Assistant[]
}

const AllAssistantsTab: React.FC<AllAssistantsTabProps> = ({ assistantGroups, onArrowClick, onAssistantPress }) => {
  // 将分组数据转换为扁平化的列表数据
  const flatData = Object.keys(assistantGroups).map(
    (groupKey): GroupItem => ({
      type: 'group',
      groupKey,
      assistants: assistantGroups[groupKey]
    })
  )

  const renderGroupItem = ({ item }: { item: GroupItem }) => (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal={20}>
        <Text>{item.groupKey.charAt(0).toUpperCase() + item.groupKey.slice(1)}</Text>
        <XStack onPress={() => onArrowClick(item.groupKey)}>
          <MaskedView style={{ width: 18, height: 18 }} maskElement={<ArrowUpRight size={18} color="black" />}>
            <LinearGradient colors={['#BAF4A5', '#315923']} start={[1, 0]} end={[0, 1]} style={{ flex: 1 }} />
          </MaskedView>
        </XStack>
      </XStack>
      <XStack flex={1}>
        <ScrollView flex={1} horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap={20}>
            {item.assistants.slice(0, 5).map(assistant => (
              <AssistantItemCard key={assistant.id} assistant={assistant} onAssistantPress={onAssistantPress} />
            ))}
          </XStack>
        </ScrollView>
      </XStack>
    </YStack>
  )

  return (
    <YStack flex={1}>
      <FlashList
        data={flatData}
        renderItem={renderGroupItem}
        estimatedItemSize={220}
        ItemSeparatorComponent={() => <YStack height={16} />}
        keyExtractor={item => item.groupKey}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}

export default AllAssistantsTab
