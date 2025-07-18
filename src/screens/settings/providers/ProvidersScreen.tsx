import { useNavigation } from '@react-navigation/native'
import { Plus } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const { providers, isLoading } = useAllProviders()

  // 新增代码：根据搜索内容过滤要显示的供应商列表
  // 1. 先筛选出所有已启用的供应商 (`p.enabled`)
  // 2. 然后，根据搜索框中的文本进行不区分大小写的过滤
  //    这里假设每个 provider 对象都有一个 'name' 字符串属性
  const displayedProviders = providers
    .filter(p => p.enabled)
    .filter(p => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
        flex: 1,
        backgroundColor: theme.background.val
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
        <SearchInput placeholder={t('settings.provider.search')} value={searchQuery} onChangeText={setSearchQuery} />

        {/* --- 修改代码：开始 --- */}
        {/* 移除了 "displayedProviders.length === 0" 的判断逻辑 */}
        {providers.length === 0 ? (
          <EmptyModelView onAddModel={onAddProvider} />
        ) : (
          <YStack flex={1} gap={8} paddingVertical={8}>
            <SettingGroupTitle>{t('settings.provider.title')}</SettingGroupTitle>
            <CustomRadialGradientBackground style={{ radius: 2 }}>
              <ScrollView backgroundColor="$colorTransparent" showsVerticalScrollIndicator={false}>
                <SettingGroup>
                  {/*
                    修改代码：渲染过滤后的供应商列表
                    如果 `displayedProviders` 为空数组，这里将不渲染任何内容
                  */}
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