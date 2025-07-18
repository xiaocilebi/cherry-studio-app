import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { Plus } from '@tamagui/lucide-icons'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { ScrollView, Text, YStack } from 'tamagui'

import { SettingContainer, SettingGroup } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { AddProviderSheet } from '@/components/settings/providers/AddProviderSheet'
import { ProviderItem } from '@/components/settings/providers/ProviderItem'
import CustomRadialGradientBackground from '@/components/ui/CustomRadialGradientBackground'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAllProviders } from '@/hooks/useProviders'

export default function ProviderListScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { providers, isLoading } = useAllProviders()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviderType, setSelectedProviderType] = useState<string | undefined>(undefined)
  const [providerName, setProviderName] = useState('')

  // --- 新增代码：开始 ---
  // 功能：根据搜索框中的文本，过滤供应商列表
  // 逻辑：检查每个供应商的名称 (p.name) 是否包含搜索文本 (searchQuery)，不区分大小写
  const filteredProviders = providers.filter(
    p => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  // --- 新增代码：结束 ---

  const handleProviderTypeChange = (value: string) => {
    setSelectedProviderType(value)
  }

  const handleProviderNameChange = (name: string) => {
    setProviderName(name)
  }

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand()
    setIsBottomSheetOpen(true)
  }

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false)
  }

  const onAddProvider = () => {
    handleOpenBottomSheet()
  }

  const handleAddProvider = () => {
    console.log('Provider Name:', providerName)
    console.log('Provider Type:', selectedProviderType)
  }

  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('settings.provider.list.title')}
        onBackPress={() => navigation.goBack()}
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
        <SettingContainer>
          <SearchInput placeholder={t('settings.provider.search')} value={searchQuery} onChangeText={setSearchQuery} />

          <YStack flex={1} gap={8}>
            <Text>{t('settings.provider.title')}</Text>
            <CustomRadialGradientBackground style={{ radius: 2 }}>
              <ScrollView backgroundColor="$colorTransparent">
                <SettingGroup>
                  {/* --- 修改代码：将渲染的列表从 providers 改为经过搜索过滤后的 filteredProviders --- */}
                  {/* --- 如果过滤后列表为空，此处将不会渲染任何内容 --- */}
                  {filteredProviders.map(p => (
                    <ProviderItem key={p.id} provider={p} mode="checked" />
                  ))}
                </SettingGroup>
              </ScrollView>
            </CustomRadialGradientBackground>
          </YStack>
        </SettingContainer>
      )}

      <AddProviderSheet
        bottomSheetRef={bottomSheetRef}
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        providerName={providerName}
        onProviderNameChange={handleProviderNameChange}
        selectedProviderType={selectedProviderType}
        onProviderTypeChange={handleProviderTypeChange}
        onAddProvider={handleAddProvider}
      />
    </SafeAreaContainer>
  )
}