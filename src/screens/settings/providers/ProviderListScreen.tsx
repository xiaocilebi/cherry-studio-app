import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Plus } from '@tamagui/lucide-icons'
import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { YStack } from 'tamagui'

import { SettingContainer, SettingGroup } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { AddProviderSheet } from '@/components/settings/providers/AddProviderSheet'
import { ProviderItem } from '@/components/settings/providers/ProviderItem'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAllProviders } from '@/hooks/useProviders'
import { Provider } from '@/types/assistant'

export default function ProviderListScreen() {
  const { t } = useTranslation()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { providers, isLoading } = useAllProviders()

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  const filteredProviders = providers.filter(
    p => p.name && p.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
  )

  const onAddProvider = () => {
    bottomSheetRef.current?.present()
  }

  const renderProviderItem = ({ item }: ListRenderItemInfo<Provider>) => (
    <ProviderItem key={item.id} provider={item} mode="checked" />
  )

  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('settings.provider.list.title')}
        rightButton={{
          icon: <Plus size={24} />,
          onPress: onAddProvider
        }}
      />
      {isLoading ? (
        <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </SafeAreaContainer>
      ) : (
        <SettingContainer paddingBottom={0}>
          <SearchInput placeholder={t('settings.provider.search')} value={searchText} onChangeText={setSearchText} />

          <YStack flex={1} height="100%">
            <SettingGroup flex={1}>
              <FlashList
                data={filteredProviders}
                renderItem={renderProviderItem}
                keyExtractor={item => item.id}
                estimatedItemSize={60}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            </SettingGroup>
          </YStack>
        </SettingContainer>
      )}

      <AddProviderSheet ref={bottomSheetRef} />
    </SafeAreaContainer>
  )
}
