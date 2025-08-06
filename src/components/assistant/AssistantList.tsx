import { FlashList } from '@shopify/flash-list'
import React, { useMemo } from 'react'
import { YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { DateGroupKey, getTimeFormatForGroup, groupItemsByDate, TimeFormat } from '@/utils/date'

import AssistantItem from './AssistantItem'

interface AssistantListProps {
  assistants: Assistant[]
}

type ListItem = {
  assistant: Assistant
  timeFormat: TimeFormat
}

const getAssistantLastUpdateTime = (assistant: Assistant): Date => {
  const latestTimestamp = assistant.topics?.reduce((latest, topic) => {
    const topicUpdateTime = new Date(topic.updatedAt).getTime()
    return topicUpdateTime > latest ? topicUpdateTime : latest
  }, 0)

  return new Date(latestTimestamp)
}

export function AssistantList({ assistants }: AssistantListProps) {
  const listData = useMemo(() => {
    const activeAssistants = assistants.filter(assistant => assistant.topics && assistant.topics.length > 0)

    const groupedAssistants = groupItemsByDate(activeAssistants, getAssistantLastUpdateTime)
    const groupOrder: DateGroupKey[] = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'lastMonth', 'older']
    const data: ListItem[] = []

    groupOrder.forEach(key => {
      const assistantList = groupedAssistants[key]

      if (assistantList && assistantList.length > 0) {
        const format = getTimeFormatForGroup(key)

        assistantList.forEach(assistant => {
          data.push({ assistant, timeFormat: format })
        })
      }
    })

    return data
  }, [assistants])

  const renderItem = ({ item }: { item: ListItem }) => {
    return <AssistantItem assistant={item.assistant} timeFormat={item.timeFormat} />
  }

  return (
    <FlashList
      data={listData}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={item => item.assistant.id}
      estimatedItemSize={50}
      ItemSeparatorComponent={() => <YStack height={20} />}
    />
  )
}
