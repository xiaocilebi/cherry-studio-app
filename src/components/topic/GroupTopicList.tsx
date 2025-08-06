import { FlashList } from '@shopify/flash-list'
import React, { useMemo } from 'react' // 引入 useMemo
import { useTranslation } from 'react-i18next'
import { Text, YStack } from 'tamagui'

import { Topic } from '@/types/assistant'
import { DateGroupKey, getTimeFormatForGroup, groupItemsByDate, TimeFormat } from '@/utils/date'

import TopicItem from './TopicItem'

interface GroupedTopicListProps {
  topics: Topic[]
}

// ListItem 类型定义现在使用导入的 TimeFormat
type ListItem = { type: 'header'; title: string } | { type: 'topic'; topic: Topic; timeFormat: TimeFormat }

export function GroupedTopicList({ topics }: GroupedTopicListProps) {
  const { t } = useTranslation()

  const listData = useMemo(() => {
    const groupedTopics = groupItemsByDate(topics, topic => new Date(topic.updatedAt))

    const groupOrder: DateGroupKey[] = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'lastMonth', 'older']
    const groupTitles: Record<DateGroupKey, string> = {
      today: t('common.today'),
      yesterday: t('common.yesterday'),
      thisWeek: t('common.this_week'),
      lastWeek: t('common.last_week'),
      lastMonth: t('common.last_month'),
      older: t('common.older')
    }

    const data: ListItem[] = []

    groupOrder.forEach(key => {
      const topicList = groupedTopics[key]

      if (topicList.length > 0) {
        data.push({ type: 'header', title: groupTitles[key] })

        const format = getTimeFormatForGroup(key)

        topicList.forEach(topic => {
          data.push({ type: 'topic', topic, timeFormat: format })
        })
      }
    })

    return data
  }, [topics, t])

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    switch (item.type) {
      case 'header':
        return (
          <Text fontWeight="bold" paddingTop={index !== 0 ? 20 : 0}>
            {item.title}
          </Text>
        )
      case 'topic':
        return <TopicItem topic={item.topic} timeFormat={item.timeFormat} />
      default:
        return null
    }
  }

  return (
    <FlashList
      data={listData}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => {
        if (item.type === 'header') {
          return `header-${item.title}-${index}`
        }

        return item.topic.id
      }}
      getItemType={item => {
        return item.type
      }}
      estimatedItemSize={60}
      ItemSeparatorComponent={() => <YStack height={10} />}
    />
  )
}
