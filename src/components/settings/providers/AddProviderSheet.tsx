import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, useTheme, XStack, YStack } from 'tamagui'

import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { loggerService } from '@/services/LoggerService'
import { saveProvider } from '@/services/ProviderService'
import { Provider, ProviderType } from '@/types/assistant'
import { uuid } from '@/utils'

import { ProviderIconButton } from './ProviderIconButton'
import { ProviderSelect } from './ProviderSelect'

const logger = loggerService.withContext('AddProviderSheet')

type AddProviderSheetProps = object

const AddProviderSheet = forwardRef<BottomSheetModal, AddProviderSheetProps>((props, ref) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isDark } = useCustomTheme()
  const insets = useSafeAreaInsets()
  const [providerId] = useState(() => uuid())

  const [providerName, setProviderName] = useState('')
  const [selectedProviderType, setSelectedProviderType] = useState<ProviderType | undefined>(undefined)

  // 处理Android返回按钮事件
  useEffect(() => {
    const backAction = () => {
      if ((ref as React.RefObject<BottomSheetModal>)?.current) {
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        return true
      }

      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [ref])

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const handleAddProvider = async () => {
    try {
      const newProvider: Provider = {
        id: providerId,
        type: selectedProviderType ?? 'openai',
        name: providerName,
        apiKey: '',
        apiHost: '',
        models: []
      }
      await saveProvider(newProvider)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    } catch (error) {
      logger.error('handleAddProvider', error as Error)
    } finally {
      setSelectedProviderType(undefined)
      setProviderName('')
    }
  }

  return (
    <BottomSheetModal
      enableDynamicSizing={true}
      ref={ref}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val
      }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={{ paddingBottom: insets.bottom }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
            <XStack width="100%" alignItems="center" justifyContent="center">
              <Text fontSize={24}>{t('settings.provider.add.title')}</Text>
            </XStack>
            <YStack width="100%" gap={24} justifyContent="center" alignItems="center">
              <ProviderIconButton providerId={providerId} />
              <YStack width="100%" gap={8}>
                <XStack gap={8}>
                  <Text color="red">*</Text>
                  <Text>{t('settings.provider.add.name')}</Text>
                </XStack>
                <BottomSheetTextInput
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: isDark ? '#19191C' : '#ffffffff',
                    borderWidth: 1,
                    borderColor: '#a0a1b066',
                    color: isDark ? '#f9f9f9ff' : '#202020ff'
                  }}
                  placeholder={t('settings.provider.add.name.placeholder')}
                  value={providerName}
                  onChangeText={setProviderName}
                />
              </YStack>
              <ProviderSelect
                value={selectedProviderType}
                onValueChange={setSelectedProviderType}
                placeholder={t('settings.provider.add.type')}
              />
              <Button
                backgroundColor="$green10"
                borderColor="$green20"
                color="$green100"
                height={44}
                width={216}
                borderRadius={15}
                paddingVertical={10}
                paddingHorizontal={15}
                fontSize={16}
                onPress={handleAddProvider}>
                {t('settings.provider.add.title')}
              </Button>
            </YStack>
          </YStack>
        </TouchableWithoutFeedback>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

export { AddProviderSheet }
