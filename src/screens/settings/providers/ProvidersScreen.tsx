import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Plus } from '@tamagui/lucide-icons'
import debounce from 'lodash/debounce'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { YStack } from 'tamagui'

import { SettingContainer, SettingGroup } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { EmptyModelView } from '@/components/settings/providers/EmptyModelView'
import { ProviderItem } from '@/components/settings/providers/ProviderItem'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAllProviders } from '@/hooks/useProviders'
import { ProvidersStackParamList } from '@/navigators/settings/ProvidersStackNavigator'
import { Provider } from '@/types/assistant'

export default function ProvidersScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<ProvidersStackParamList>>()

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  const { providers, isLoading } = useAllProviders()

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  const displayedProviders = providers
    .filter(p => p.enabled)
    .filter(p => p.name.toLowerCase().includes(debouncedSearchText.toLowerCase()))

  const onAddProvider = () => {
    navigation.navigate('ProviderListScreen')
  }

  const renderProviderItem = ({ item }: ListRenderItemInfo<Provider>) => (
    <ProviderItem key={item.id} provider={item} mode="enabled" />
  )

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer
      style={{
        flex: 1
      }}>
      <HeaderBar
        title={t('settings.provider.title')}
        rightButton={{
          icon: <Plus size={24} />,
          onPress: onAddProvider
        }}
      />

      <SettingContainer paddingBottom={0}>
        <SearchInput placeholder={t('settings.provider.search')} value={searchText} onChangeText={setSearchText} />

        {providers.length === 0 ? (
          <EmptyModelView onAddModel={onAddProvider} />
        ) : (
          <YStack flex={1} height="100%">
            <SettingGroup flex={1}>
              <FlashList
                data={displayedProviders}
                renderItem={renderProviderItem}
                keyExtractor={item => item.id}
                estimatedItemSize={60}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            </SettingGroup>
          </YStack>
        )}
      </SettingContainer>
    </SafeAreaContainer>
  )
}
