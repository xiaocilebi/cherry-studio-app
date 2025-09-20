import { DrawerActions, useNavigation } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'

import { Menu, MessageSquareDiff } from '@/componentsV2/icons/LucideIcon'
import { YStack, HeaderBar, TopicList ,SafeAreaContainer, DrawerGestureWrapper , SearchInput } from '@/componentsV2'

import { useSearch } from '@/hooks/useSearch'
import { useTopics } from '@/hooks/useTopic'
import { getDefaultAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { DrawerNavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'

export default function TopicScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()
  const { topics, isLoading } = useTopics()

  const {
    searchText,
    setSearchText,
    filteredItems: filteredTopics
  } = useSearch(
    topics,
    useCallback(topic => [topic.name], []),
    { delay: 300 }
  )

  const handleAddNewTopic = async () => {
    const defaultAssistant = await getDefaultAssistant()
    const newTopic = await createNewTopic(defaultAssistant)
    navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: newTopic.id } })
  }

  const handleMenuPress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigation.dispatch(DrawerActions.openDrawer())
  }

  if (isLoading) {
    return (
      <SafeAreaContainer className="items-center justify-center">
        <DrawerGestureWrapper>
          <View collapsable={false} className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        </DrawerGestureWrapper>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer className="flex-1">
      <DrawerGestureWrapper>
        <View collapsable={false} className="flex-1">
          <HeaderBar
            title={t('topics.title.recent')}
            leftButton={{
              icon: <Menu size={24} />,
              onPress: handleMenuPress
            }}
            rightButton={{
              icon: <MessageSquareDiff size={24} />,
              onPress: handleAddNewTopic
            }}
          />
          <YStack className="flex-1 gap-[15px]">
            <View className="px-5">
              <SearchInput
                placeholder={t('common.search_placeholder')}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TopicList topics={filteredTopics} enableScroll={true} />
          </YStack>
        </View>
      </DrawerGestureWrapper>
    </SafeAreaContainer>
  )
}
