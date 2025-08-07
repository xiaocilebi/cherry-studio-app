import { useNavigation } from '@react-navigation/native'
import { Plus } from '@tamagui/lucide-icons'
import debounce from 'lodash/debounce'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { ScrollView, useTheme, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { EmptyModelView } from '@/components/settings/providers/EmptyModelView'
import { ProviderItem } from '@/components/settings/providers/ProviderItem'
import CustomRadialGradientBackground from '@/components/ui/CustomRadialGradientBackground'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAllProviders } from '@/hooks/useProviders'
import { NavigationProps } from '@/types/naviagate'

export default function ProvidersScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()

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
        onBackPress={() => navigation.goBack()}
        rightButton={{
          icon: <Plus size={24} />,
          onPress: onAddProvider
        }}
      />

      <SettingContainer>
        <SearchInput placeholder={t('settings.provider.search')} value={searchText} onChangeText={setSearchText} />

        {providers.length === 0 ? (
          <EmptyModelView onAddModel={onAddProvider} />
        ) : (
          <YStack flex={1} gap={8} paddingVertical={8}>
            <SettingGroupTitle>{t('settings.provider.title')}</SettingGroupTitle>
            <CustomRadialGradientBackground style={{ radius: 2 }}>
              <ScrollView backgroundColor="$colorTransparent" showsVerticalScrollIndicator={false}>
                <SettingGroup>
                  {displayedProviders.map(p => (
                    <ProviderItem key={p.id} provider={p} mode="enabled" />
                  ))}
                </SettingGroup>
              </ScrollView>
            </CustomRadialGradientBackground>
          </YStack>
        )}
      </SettingContainer>
    </SafeAreaContainer>
  )
}
