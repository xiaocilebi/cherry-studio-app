import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { forwardRef } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, useTheme, XStack, YStack } from 'tamagui'

import { NavigationProps } from '@/types/naviagate'
import { WebSearchProvider } from '@/types/websearch'
import { useIsDark } from '@/utils'

import { SettingHelpText } from '../settings'
import { WebsearchProviderIcon } from '../ui/WebsearchIcon'

interface WebsearchSheetProps {
  providerId?: string
  setProviderId: (providerId: string | undefined) => void
  providers: WebSearchProvider[]
}

const WebsearchSheet = forwardRef<BottomSheetModal, WebsearchSheetProps>(
  ({ providers, providerId, setProviderId }, ref) => {
    const theme = useTheme()
    const isDark = useIsDark()
    const { t } = useTranslation()
    const navigation = useNavigation<NavigationProps>()

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    )

    const handleProviderToggle = (id: string) => {
      if (id === providerId) {
        setProviderId(undefined)
      } else {
        setProviderId(id)
      }
    }

    const handleNavigateToWebSearhPage = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      navigation.navigate('WebSearchSettingsScreen')
    }

    return (
      <BottomSheetModal
        snapPoints={['30%']}
        enableDynamicSizing={false}
        ref={ref}
        backgroundStyle={{
          borderRadius: 30,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.color.val
        }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <YStack gap={5} padding="20">
            {providers.length > 0 ? (
              // 如果有提供商，则显示列表
              <YStack gap={5} padding="20">
                {providers.map(p => (
                  <Button
                    key={p.id}
                    onPress={() => handleProviderToggle(p.id)}
                    justifyContent="space-between"
                    chromeless
                    paddingHorizontal={8}
                    paddingVertical={8}
                    borderColor={providerId === p.id ? (isDark ? '$green20Dark' : '$green20Light') : 'transparent'}
                    backgroundColor={providerId === p.id ? (isDark ? '$green10Dark' : '$green10Light') : 'transparent'}>
                    <XStack gap={8} flex={1} alignItems="center" justifyContent="space-between" width="100%">
                      <XStack gap={8} flex={1} alignItems="center" maxWidth="80%">
                        {/* Provider icon */}
                        <XStack justifyContent="center" alignItems="center" flexShrink={0}>
                          <WebsearchProviderIcon provider={p} />
                        </XStack>
                        {/* Provider name */}
                        <Text numberOfLines={1} ellipsizeMode="tail" flex={1}>
                          {p.name}
                        </Text>
                      </XStack>
                      <XStack gap={8} alignItems="center" flexShrink={0}></XStack>
                    </XStack>
                  </Button>
                ))}
              </YStack>
            ) : (
              <YStack flex={1} justifyContent="center" alignItems="center" padding="20">
                <Button onPress={handleNavigateToWebSearhPage}>
                  <YStack alignItems="center">
                    <Text>{t('settings.websearch.empty')}</Text>
                    <SettingHelpText>{t('settings.websearch.empty.description')}</SettingHelpText>
                  </YStack>
                </Button>
              </YStack>
            )}
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default WebsearchSheet
