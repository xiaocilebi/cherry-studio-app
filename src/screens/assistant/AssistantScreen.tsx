import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, YStack } from 'tamagui'

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
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { getAssistantWithTopic } from '@/utils/assistants'
import AssistantItemSkeleton from '@/components/assistant/AssistantItemSkeleton'

export default function AssistantScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  // 搜索状态
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  const { topics } = useTopics()
  const { assistants, isLoading } = useExternalAssistants()
  const assistantWithTopics = getAssistantWithTopic(assistants, topics)
  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  const filteredAssistants = assistantWithTopics.filter(
    assistant =>
      assistant.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(debouncedSearchText.toLowerCase())
  )

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


  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('assistants.title.mine')}
        rightButton={{
          icon: <UnionPlusIcon size={24} />,
          onPress: onAddAssistant
        }}
      />
      <SettingContainer>
        <SearchInput placeholder={t('common.search_placeholder')} value={searchText} onChangeText={setSearchText} />

        {isLoading ? (
                 <FlashList
                   data={Array.from({ length: 5 })}
                   renderItem={() => <AssistantItemSkeleton />}
                   keyExtractor={(_, index) => `skeleton-${index}`}
                   estimatedItemSize={80}
                   ItemSeparatorComponent={() => <YStack height={16} />}
                 />
               ) : (
                 <FlashList
                   showsVerticalScrollIndicator={false}
                   data={filteredAssistants}
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
               )}
      </SettingContainer>
      <AssistantItemSheet ref={bottomSheetRef} assistant={selectedAssistant} source='external'/>
    </SafeAreaContainer>
  )
}
