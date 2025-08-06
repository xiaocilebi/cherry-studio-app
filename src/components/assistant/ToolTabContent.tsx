import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ChevronRight } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

import { useWebsearchProviders } from '@/hooks/useWebsearchProviders'
import { Assistant } from '@/types/assistant'
import { useIsDark } from '@/utils'

import { SettingGroup, SettingRow, SettingRowTitle } from '../settings'
import WebsearchSheet from '../sheets/WebsearchSheet'

interface ToolTabContentProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => void
}

export function ToolTabContent({ assistant, updateAssistant }: ToolTabContentProps) {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { apiProviders } = useWebsearchProviders()
  const [providerId, setProviderId] = useState<string | undefined>(assistant.webSearchProviderId)

  useEffect(() => {
    updateAssistant({
      ...assistant,
      webSearchProviderId: providerId
    })
  }, [providerId])

  const handlePress = () => {
    bottomSheetModalRef.current?.present()
  }

  const provider = apiProviders.find(p => p.id === providerId)

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
      <SettingGroup>
        <YStack flex={1}>
          <SettingRowTitle paddingHorizontal={16}>{t('settings.websearch.provider.title')}</SettingRowTitle>

          <SettingRow>
            <Button
              chromeless
              width="100%"
              height="100%"
              paddingHorizontal={16}
              paddingVertical={15}
              iconAfter={<ChevronRight size={16} />}
              backgroundColor={isDark ? '$uiCardDark' : '$uiCardLight'}
              onPress={handlePress}>
              <XStack flex={1} alignItems="center" overflow="hidden" justifyContent="space-between">
                <XStack maxWidth="45%" gap={5}>
                  {provider ? (
                    <Text flexShrink={0} numberOfLines={1} ellipsizeMode="tail">
                      {provider.name}
                    </Text>
                  ) : (
                    <Text flex={1} numberOfLines={1} ellipsizeMode="tail">
                      {t('settings.websearch.empty')}
                    </Text>
                  )}
                </XStack>
              </XStack>
            </Button>
          </SettingRow>
        </YStack>
      </SettingGroup>
      <WebsearchSheet
        ref={bottomSheetModalRef}
        providerId={providerId}
        setProviderId={setProviderId}
        providers={apiProviders.filter(p => p.apiKey)}
      />
    </MotiView>
  )
}
