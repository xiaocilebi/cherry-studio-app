import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { View, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'

import GeneralSettings from './GeneralSettings'
import ProviderSettings from './ProviderSettings'

export default function WebSearchSettingsScreen() {
  const { t } = useTranslation()

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <KeyboardAwareScrollView bottomOffset={40} style={{ flex: 1 }}>
        <HeaderBar title={t('settings.websearch.title')} />
        <View flex={1}>
          <SettingContainer>
            <YStack gap={24} flex={1}>
              <ProviderSettings />

              <GeneralSettings />

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
      </KeyboardAwareScrollView>
    </SafeAreaContainer>
  )
}
