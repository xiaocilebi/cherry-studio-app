import { useNavigation } from '@react-navigation/native'
import { PenSquare } from '@tamagui/lucide-icons'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { GroupedTopicList } from '@/components/topic/GroupTopicList'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useTopics } from '@/hooks/useTopic'
import { getDefaultAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { NavigationProps } from '@/types/naviagate'

export default function TopicScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  const { topics, isLoading } = useTopics()

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  const filteredTopics = topics.filter(topic => topic.name.toLowerCase().includes(debouncedSearchText.toLowerCase()))

  const handleAddNewTopic = async () => {
    const defaultAssistant = await getDefaultAssistant()
    const newTopic = await createNewTopic(defaultAssistant)
    navigation.navigate('ChatScreen', { topicId: newTopic.id })
  }

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar
        title={t('topics.title.recent')}
        
        rightButton={{
          icon: <PenSquare size={24} />,
          onPress: handleAddNewTopic
        }}
      />
      <SettingContainer>
        <SearchInput placeholder={t('common.search_placeholder')} value={searchText} onChangeText={setSearchText} />
        <GroupedTopicList topics={filteredTopics} />
      </SettingContainer>
    </SafeAreaContainer>
  )
}
