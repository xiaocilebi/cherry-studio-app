import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { PenSquare } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'

import AssistantItem from '@/components/assistant/AssistantItem'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useStarAssistants } from '@/hooks/useAssistant'
import { useTopics } from '@/hooks/useTopic'
import { createAssistant } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { NavigationProps } from '@/types/naviagate'
import { getAssistantWithTopic } from '@/utils/assistants'
const logger = loggerService.withContext('DataBase Assistants')

export default function AssistantScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  // 筛选状态
  const [showTags, setShowTags] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showRecents, setShowRecents] = useState(false)
  const { topics } = useTopics()
  const { assistants, isLoading } = useStarAssistants()
  const assistantWithTopics = getAssistantWithTopic(assistants, topics)

  const onAddAssistant = async () => {
    const newAssistant = await createAssistant()
    navigation.navigate('AssistantDetailScreen', { assistantId: newAssistant.id })
  }

  const handleRecentFilter = () => {
    setShowRecents(!showRecents)
    // 在这里处理筛选逻辑
    logger.info('Filter by recents:', !showRecents)
  }

  const handleSavedFilter = () => {
    setShowSaved(!showSaved)
    // 在这里处理筛选逻辑
    logger.info('Filter by saved:', !showSaved)
  }

  const handleTagsFilter = () => {
    setShowTags(!showTags)
    // 在这里处理筛选逻辑
    logger.info('Filter by tags:', !showTags)
  }

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('assistants.title.recent')}
        onBackPress={() => navigation.goBack()}
        rightButton={{
          icon: <PenSquare size={24} />,
          onPress: onAddAssistant
        }}
      />
      <SettingContainer>
        <SearchInput placeholder={t('common.search_placeholder')} />
        <XStack gap={6}>
          {/* 多选框 */}
          <Button
            height={30}
            borderRadius={20}
            backgroundColor={showTags ? '$backgroundGreen' : undefined}
            color={showTags ? '$foregroundGreen' : undefined}
            onPress={handleTagsFilter}>
            Tags
          </Button>
          <Button
            fontSize={12}
            height={30}
            borderRadius={20}
            backgroundColor={showSaved ? '$backgroundGreen' : undefined}
            color={showSaved ? '$foregroundGreen' : undefined}
            onPress={handleSavedFilter}>
            {t('button.save')}
          </Button>
          <Button
            fontSize={12}
            height={30}
            borderRadius={20}
            backgroundColor={showRecents ? '$backgroundGreen' : undefined}
            color={showRecents ? '$foregroundGreen' : undefined}
            onPress={handleRecentFilter}>
            {t('button.recents')}
          </Button>
        </XStack>

        <FlashList
          showsVerticalScrollIndicator={false}
          data={assistantWithTopics}
          renderItem={({ item }) => <AssistantItem assistant={item} />}
          keyExtractor={item => item.id}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <YStack height={16} />}
          ListEmptyComponent={
            <YStack flex={1} justifyContent="center" alignItems="center" paddingTop="$8">
              <Text>{t('common.no_results_found')}</Text>
            </YStack>
          }
        />
      </SettingContainer>
    </SafeAreaContainer>
  )
}
