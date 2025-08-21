import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { View, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'

import GeneralSettings from './GeneralSettings'
import ProviderSettings from './ProviderSettings'

export default function WebSearchSettingsScreen() {
  const { t } = useTranslation()

  // General settings state
  const [searchWithDates, setSearchWithDates] = useState<boolean>(true)
  const [overrideSearchService, setOverrideSearchService] = useState<boolean>(true)
  const [searchCount, setSearchCount] = useState<number>(6)
  const [contentLimit, setContentLimit] = useState<string>('2000')

  // General settings handlers
  const handleSearchCountChange = (value: number[]) => {
    setSearchCount(value[0])
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <HeaderBar title={t('settings.websearch.title')} />
        <View flex={1}>
          <SettingContainer>
            <YStack gap={24} flex={1}>
              <ProviderSettings />

              <GeneralSettings
                searchWithDates={searchWithDates}
                onSearchWithDatesChange={setSearchWithDates}
                overrideSearchService={overrideSearchService}
                onOverrideSearchServiceChange={setOverrideSearchService}
                searchCount={searchCount}
                onSearchCountChange={handleSearchCountChange}
                contentLimit={contentLimit}
                onContentLimitChange={setContentLimit}
              />

              {/*<BlacklistSettings
                blacklistText={blacklistText}
                onBlacklistTextChange={setBlacklistText}
                subscriptions={blacklistSubscription}
                onRefreshSubscription={handleRefreshSubscription}
                onRefreshAllSubscriptions={handleRefreshAllSubscriptions}
                onAddSubscription={handleAddSubscription}
              />*/}
            </YStack>
          </SettingContainer>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}
