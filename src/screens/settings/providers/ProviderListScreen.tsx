import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { Plus } from '@tamagui/lucide-icons'

import debounce from 'lodash/debounce'

import React, { useRef, useState, useCallback } from 'react'
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
import { loggerService } from '@/services/LoggerService'
const logger = loggerService.withContext('ProviderListScreen')

export default function ProviderListScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { providers, isLoading } = useAllProviders()
  

  const [inputValue, setInputValue] = useState('')

  const [filterQuery, setFilterQuery] = useState('')

  const [selectedProviderType, setSelectedProviderType] = useState<string | undefined>(undefined)
  const [providerName, setProviderName] = useState('')


  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setFilterQuery(query)
    }, 500),
    [] 
  )

  
  const handleInputChange = (text: string) => {
    
    setInputValue(text)
    
    debouncedSetQuery(text)
  }

 
  const filteredProviders = providers.filter(
    p => p.name && p.name.toLowerCase().includes(filterQuery.toLowerCase())
  )

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
    logger.info('Provider Name:', providerName)
    logger.info('Provider Type:', selectedProviderType)
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
         
          <SearchInput
            placeholder={t('settings.provider.search')}
            value={inputValue}
            onChangeText={handleInputChange}
          />

          <YStack flex={1} gap={8}>
            <Text>{t('settings.provider.title')}</Text>
            <CustomRadialGradientBackground style={{ radius: 2 }}>
              <ScrollView backgroundColor="$colorTransparent">
                <SettingGroup>
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