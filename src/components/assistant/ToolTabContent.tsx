import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ChevronRight } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

import { useWebsearchProviders } from '@/hooks/useWebsearchProviders'
import { Assistant } from '@/types/assistant'

import { SettingRowTitle } from '../settings'
import WebsearchSheet from '../sheets/WebsearchSheet'
import { WebsearchProviderIcon } from '../ui/WebsearchIcon'

interface ToolTabContentProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => void
}

export function ToolTabContent({ assistant, updateAssistant }: ToolTabContentProps) {
  const { t } = useTranslation()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { apiProviders } = useWebsearchProviders()

  const handlePress = () => {
    bottomSheetModalRef.current?.present()
  }

  const provider = apiProviders.find(p => p.id === assistant.webSearchProviderId)

  return (
    <MotiView
      style={{ flex: 1, gap: 30 }}
      from={{ opacity: 0, translateY: 10 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ opacity: 1, translateY: -10 }}
      transition={{
        type: 'timing'
      }}>
      <YStack gap={5}>
        <SettingRowTitle>{t('settings.websearch.provider.title')}</SettingRowTitle>
        <Button
          chromeless
          height={30}
          paddingHorizontal={16}
          paddingVertical={23}
          iconAfter={<ChevronRight size={16} />}
          backgroundColor="$uiCardBackground"
          onPress={handlePress}>
          <XStack height={20} flex={1} alignItems="center" overflow="hidden" justifyContent="space-between">
            <XStack maxWidth="45%" gap={5}>
              {provider ? (
                <XStack gap={8} flex={1} alignItems="center" maxWidth="80%">
                  {/* Provider icon */}
                  <XStack justifyContent="center" alignItems="center" flexShrink={0}>
                    <WebsearchProviderIcon provider={provider} />
                  </XStack>
                  {/* Provider name */}
                  <Text lineHeight={20} numberOfLines={1} ellipsizeMode="tail" flex={1}>
                    {provider.name}
                  </Text>
                </XStack>
              ) : (
                <Text lineHeight={20} flex={1} numberOfLines={1} ellipsizeMode="tail">
                  {t('settings.websearch.empty')}
                </Text>
              )}
            </XStack>
          </XStack>
        </Button>
      </YStack>
      <WebsearchSheet
        ref={bottomSheetModalRef}
        assistant={assistant}
        updateAssistant={updateAssistant}
        providers={apiProviders.filter(p => p.apiKey)}
      />
    </MotiView>
  )
}
