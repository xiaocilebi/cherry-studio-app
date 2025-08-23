import BottomSheet from '@gorhom/bottom-sheet'
import { ChevronsRight } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Spinner, Text, View, XStack, YStack } from 'tamagui'

import { ISheet } from '@/components/ui/Sheet'
import { ApiStatus } from '@/types/assistant'

interface ApiCheckSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onStartModelCheck: () => void
  checkApiStatus: ApiStatus
}

export function ApiCheckSheet({
  bottomSheetRef,
  isOpen,
  onClose,
  apiKey,
  onStartModelCheck,
  checkApiStatus
}: ApiCheckSheetProps) {
  const { t } = useTranslation()
  const sheetSnapPoints = ['40%']

  return (
    <ISheet bottomSheetRef={bottomSheetRef} isOpen={isOpen} onClose={onClose} snapPoints={sheetSnapPoints}>
      <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
        <XStack width="100%" alignItems="center" justifyContent="center">
          <Text fontSize={24}>{t('settings.provider.api_check.title')}</Text>
        </XStack>
        <XStack width="100%" alignItems="center" justifyContent="center">
          <Button
            height={60}
            width={224}
            borderRadius={70}
            backgroundColor="$color1"
            disabled={!apiKey || checkApiStatus !== 'idle'}
            onPress={onStartModelCheck}>
            {checkApiStatus === 'processing' && (
              <View>
                <XStack gap={10} width="100%" alignItems="center" justifyContent="center">
                  <Spinner size="small" color="$green100" />
                  <Text fontSize={18} fontWeight="bold" color="$green100">
                    {t('button.checking')}
                  </Text>
                </XStack>
              </View>
            )}

            {checkApiStatus === 'idle' && (
              <View>
                <XStack width="100%" alignItems="center" justifyContent="space-between">
                  <Text fontSize={18} fontWeight="bold" color="$green100">
                    {t('button.start_check_model')}
                  </Text>
                  <ChevronsRight color="$green100" />
                </XStack>
              </View>
            )}

            {checkApiStatus === 'success' && (
              <View>
                <XStack width="100%" alignItems="center" justifyContent="space-between">
                  <Text fontSize={18} fontWeight="bold" color="$green100">
                    {t('button.success')}
                  </Text>
                </XStack>
              </View>
            )}
          </Button>
        </XStack>
      </YStack>
    </ISheet>
  )
}
