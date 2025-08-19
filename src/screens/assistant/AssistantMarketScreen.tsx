import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Tabs, Text } from 'tamagui'

import AllAssistantsTab from '@/components/assistant/market/AllAssistantsTab'
import AssistantItemSheet from '@/components/assistant/market/AssistantItemSheet'
import CategoryAssistantsTab from '@/components/assistant/market/CategoryAssistantsTab'
import { UnionIcon } from '@/components/icons/UnionIcon'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { useBuiltInAssistants } from '@/hooks/useAssistant'
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { groupByCategories } from '@/utils/assistants'

import SafeAreaContainer from '../../components/ui/SafeAreaContainer'

interface TabConfig {
  value: string
  label: string
}

type FilterType = 'all' | string

export default function AssistantMarketScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)

  const { assistants: builtInAssistants } = useBuiltInAssistants()

  const handleAssistantItemPress = (assistant: Assistant) => {
    setSelectedAssistant(assistant)
    bottomSheetRef.current?.present()
  }

  const [actualFilterType, setActualFilterType] = useState<FilterType>('all')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  // Filter assistants by search text first
  const getBaseFilteredAssistants = (systemAssistants: Assistant[], searchText: string) => {
    if (!searchText) {
      return systemAssistants
    }

    const lowerSearchText = searchText.toLowerCase().trim()

    if (!lowerSearchText) {
      return systemAssistants
    }

    return systemAssistants.filter(
      assistant =>
        (assistant.name && assistant.name.toLowerCase().includes(lowerSearchText)) ||
        (assistant.id && assistant.id.toLowerCase().includes(lowerSearchText))
    )
  }

  const baseFilteredAssistants = getBaseFilteredAssistants(builtInAssistants, debouncedSearchText)

  const assistantGroupsForDisplay = groupByCategories(baseFilteredAssistants)

  const assistantGroupsForTabs = groupByCategories(builtInAssistants)

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  // 过滤助手逻辑 for CategoryAssistantsTab
  const filterAssistants =
    actualFilterType === 'all'
      ? baseFilteredAssistants
      : baseFilteredAssistants.filter(assistant => assistant.group && assistant.group.includes(actualFilterType))

  const getTabConfigs = (assistantGroupsForTabs: Record<string, Assistant[]>) => {
    const groupKeys = Object.keys(assistantGroupsForTabs).sort()

    const allTab: TabConfig = {
      value: 'all',
      label: t('assistants.market.groups.all')
    }

    const dynamicTabs: TabConfig[] = groupKeys.map(groupKey => ({
      value: groupKey,
      label: t(`assistants.market.groups.${groupKey}`, groupKey.charAt(0).toUpperCase() + groupKey.slice(1))
    }))

    return [allTab, ...dynamicTabs]
  }

  const tabConfigs = getTabConfigs(assistantGroupsForTabs)

  const getTabStyle = (tabValue: string) => ({
    height: '100%',
    backgroundColor: actualFilterType === tabValue ? '$background' : 'transparent',
    borderRadius: 15
  })

  const handleArrowClick = (groupKey: string) => {
    if (groupKey) {
      setActualFilterType(groupKey)
    }
  }



  const handleNavigateToMyAssistants = () => {
    navigation.navigate('AssistantScreen')
  }

  const renderTabList = (
    <Tabs.List gap={10} flexDirection="row" height={34}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabConfigs.map(({ value, label }) => (
          <Tabs.Tab key={value} value={value} {...getTabStyle(value)}>
            <Text>{label}</Text>
          </Tabs.Tab>
        ))}
      </ScrollView>
    </Tabs.List>
  )

  const renderTabContents = (
    <>
      <Tabs.Content value={'all'} flex={1}>
        <AllAssistantsTab
          assistantGroups={assistantGroupsForDisplay}
          onArrowClick={handleArrowClick}
          onAssistantPress={handleAssistantItemPress}
        />
      </Tabs.Content>
      {tabConfigs
        .filter(({ value }) => value !== 'all')
        .map(({ value }) => (
          <Tabs.Content key={value} value={value} flex={1}>
            <CategoryAssistantsTab assistants={filterAssistants} onAssistantPress={handleAssistantItemPress} />
          </Tabs.Content>
        ))}
    </>
  )

  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('assistants.market.title')}
        
        rightButton={{
          icon: <UnionIcon size={24} />,
          onPress: handleNavigateToMyAssistants
        }}
      />
      <SettingContainer>
        <SearchInput
          placeholder={t('assistants.market.search_placeholder')}
          value={searchText}
          onChangeText={setSearchText}
        />

        <Tabs
          gap={10}
          defaultValue={'all'}
          value={actualFilterType}
          onValueChange={setActualFilterType}
          orientation="horizontal"
          flexDirection="column"
          flex={1}>
          {renderTabList}
          {renderTabContents}
        </Tabs>
      </SettingContainer>
      <AssistantItemSheet ref={bottomSheetRef} assistant={selectedAssistant} />
    </SafeAreaContainer>
  )
}
