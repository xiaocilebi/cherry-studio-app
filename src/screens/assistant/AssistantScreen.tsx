import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { ChevronDown, Funnel } from '@tamagui/lucide-icons'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'

import AssistantItem from '@/components/assistant/AssistantItem'
import AssistantItemSheet from '@/components/assistant/market/AssistantItemSheet'
import { UnionPlusIcon } from '@/components/icons/UnionPlusIcon'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useExternalAssistants } from '@/hooks/useAssistant'
import { useTopics } from '@/hooks/useTopic'
import { createAssistant } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'
import { getAssistantWithTopic } from '@/utils/assistants'
import { getGreenColor, getTextSecondaryColor } from '@/utils/color'
const logger = loggerService.withContext('DataBase Assistants')

export default function AssistantScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const isDark = useIsDark()
  // 筛选状态
  const [showTags, setShowTags] = useState(false)
  const [showSorted, setShowSorted] = useState(false)
  const [showRecents, setShowRecents] = useState(false)
  const { topics } = useTopics()
  const { assistants, isLoading } = useExternalAssistants()
  const assistantWithTopics = getAssistantWithTopic(assistants, topics)

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)

  const handleAssistantItemPress = (assistant: Assistant) => {
    setSelectedAssistant(assistant)
    bottomSheetRef.current?.present()
  }

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
    setShowSorted(!showSorted)
    // 在这里处理筛选逻辑
    logger.info('Filter by saved:', !showSorted)
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
          icon: <UnionPlusIcon size={24} />,
          onPress: onAddAssistant
        }}
      />
      <SettingContainer>
        <SearchInput placeholder={t('common.search_placeholder')} />
        <XStack gap={14}>
          {/* 多选框 */}
          <Button
            fontSize={12}
            paddingHorizontal={10}
            height={30}
            borderRadius={20}
            backgroundColor={showSorted ? getGreenColor(isDark, 10) : isDark ? '$uiCardDark' : '$uiCardLight'}
            color={showSorted ? getGreenColor(isDark, 100) : getTextSecondaryColor(isDark)}
            onPress={handleSavedFilter}
            iconAfter={<Funnel />}>
            {t('button.sort')}
          </Button>
          <Button
            fontSize={12}
            height={30}
            paddingHorizontal={10}
            borderRadius={20}
            backgroundColor={showTags ? getGreenColor(isDark, 10) : isDark ? '$uiCardDark' : '$uiCardLight'}
            color={showTags ? getGreenColor(isDark, 100) : getTextSecondaryColor(isDark)}
            onPress={handleTagsFilter}
            iconAfter={<ChevronDown />}>
            {t('button.tag')}
          </Button>
          <Button
            fontSize={12}
            paddingHorizontal={10}
            height={30}
            borderRadius={20}
            backgroundColor={showRecents ? getGreenColor(isDark, 10) : isDark ? '$uiCardDark' : '$uiCardLight'}
            color={showRecents ? getGreenColor(isDark, 100) : getTextSecondaryColor(isDark)}
            onPress={handleRecentFilter}>
            {t('button.recents')}
          </Button>
        </XStack>

        <FlashList
          showsVerticalScrollIndicator={false}
          data={assistantWithTopics}
          renderItem={({ item }) => <AssistantItem assistant={item} onAssistantPress={handleAssistantItemPress} />}
          keyExtractor={item => item.id}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <YStack height={16} />}
          ListEmptyComponent={
            <YStack flex={1} justifyContent="center" alignItems="center" paddingTop="$8">
              <Text>{t('settings.assistant.empty')}</Text>
            </YStack>
          }
        />
      </SettingContainer>
      <AssistantItemSheet ref={bottomSheetRef} assistant={selectedAssistant} />
    </SafeAreaContainer>
  )
}
