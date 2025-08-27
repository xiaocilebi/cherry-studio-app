import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { ScrollView, Tabs, Text, View } from 'tamagui'

import AllAssistantsTab from '@/components/assistant/market/AllAssistantsTab'
import AssistantItemSheet from '@/components/assistant/market/AssistantItemSheet'
import CategoryAssistantsTab from '@/components/assistant/market/CategoryAssistantsTab'
import { UnionIcon } from '@/components/icons/UnionIcon'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { useBuiltInAssistants } from '@/hooks/useAssistant'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
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
  const panGesture = useSwipeGesture()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)

  const { builtInAssistants } = useBuiltInAssistants()

  // 添加加载状态
  const [isInitializing, setIsInitializing] = useState(true)

  const handleAssistantItemPress = useCallback((assistant: Assistant) => {
    setSelectedAssistant(assistant)
    bottomSheetRef.current?.present()
  }, [])

  const [actualFilterType, setActualFilterType] = useState<FilterType>('all')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = useMemo(
    () =>
      debounce((text: string) => {
        setDebouncedSearchText(text)
      }, 300),
    []
  )

  // 使用 useMemo 优化计算
  const baseFilteredAssistants = useMemo(() => {
    if (!debouncedSearchText) {
      return builtInAssistants
    }

    const lowerSearchText = debouncedSearchText.toLowerCase().trim()

    if (!lowerSearchText) {
      return builtInAssistants
    }

    return builtInAssistants.filter(
      assistant =>
        (assistant.name && assistant.name.toLowerCase().includes(lowerSearchText)) ||
        (assistant.id && assistant.id.toLowerCase().includes(lowerSearchText))
    )
  }, [builtInAssistants, debouncedSearchText])

  const assistantGroupsForDisplay = useMemo(() => {
    return groupByCategories(baseFilteredAssistants)
  }, [baseFilteredAssistants])

  const assistantGroupsForTabs = useMemo(() => {
    return groupByCategories(builtInAssistants)
  }, [builtInAssistants])

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [searchText, debouncedSetSearch])

  // 初始化完成效果
  useEffect(() => {
    if (builtInAssistants.length > 0 && isInitializing) {
      // 使用 setTimeout 确保 UI 渲染在下一个事件循环
      setTimeout(() => {
        setIsInitializing(false)
      }, 100)
    }
  }, [builtInAssistants, isInitializing])

  // 过滤助手逻辑 for CategoryAssistantsTab
  const filterAssistants = useMemo(() => {
    return actualFilterType === 'all'
      ? baseFilteredAssistants
      : baseFilteredAssistants.filter(assistant => assistant.group && assistant.group.includes(actualFilterType))
  }, [actualFilterType, baseFilteredAssistants])

  const tabConfigs = useMemo(() => {
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
  }, [assistantGroupsForTabs, t])

  const getTabStyle = useCallback(
    (tabValue: string) => ({
      height: '100%',
      backgroundColor: actualFilterType === tabValue ? '$background' : 'transparent',
      borderRadius: 15
    }),
    [actualFilterType]
  )

  const handleArrowClick = useCallback((groupKey: string) => {
    if (groupKey) {
      setActualFilterType(groupKey)
    }
  }, [])

  const handleNavigateToMyAssistants = useCallback(() => {
    navigation.navigate('AssistantScreen')
  }, [navigation])

  const renderTabList = useMemo(
    () => (
      <Tabs.List gap={10} flexDirection="row" height={34}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabConfigs.map(({ value, label }) => (
            <Tabs.Tab key={value} value={value} {...getTabStyle(value)}>
              <Text>{label}</Text>
            </Tabs.Tab>
          ))}
        </ScrollView>
      </Tabs.List>
    ),
    [tabConfigs, getTabStyle]
  )

  const renderTabContents = useMemo(
    () => (
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
    ),
    [assistantGroupsForDisplay, tabConfigs, filterAssistants, handleArrowClick, handleAssistantItemPress]
  )

  // 显示加载状态
  if (isInitializing) {
    return (
      <SafeAreaContainer>
        <GestureDetector gesture={panGesture}>
          <View collapsable={false} style={{ flex: 1 }}>
            <HeaderBar
              title={t('assistants.market.title')}
              rightButton={{
                icon: <UnionIcon size={24} />,
                onPress: handleNavigateToMyAssistants
              }}
            />
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" />
            </View>
          </View>
        </GestureDetector>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <GestureDetector gesture={panGesture}>
        <View collapsable={false} style={{ flex: 1 }}>
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
          <AssistantItemSheet ref={bottomSheetRef} assistant={selectedAssistant} source="builtIn" />
        </View>
      </GestureDetector>
    </SafeAreaContainer>
  )
}
