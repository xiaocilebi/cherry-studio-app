import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { PenLine } from '@tamagui/lucide-icons'
import { forwardRef, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Button, Text, useTheme, XStack, YStack } from 'tamagui'

import { DefaultProviderIcon } from '@/components/icons/DefaultProviderIcon'
import { AvatarEditButton } from '@/components/ui/AvatarEditButton'
import { loggerService } from '@/services/LoggerService'
import { saveProvider } from '@/services/ProviderService'
import { Provider, ProviderType } from '@/types/assistant'
import { useIsDark, uuid } from '@/utils'

import { ProviderSelect } from './ProviderSelect'

const logger = loggerService.withContext('AddProviderSheet')

type AddProviderSheetProps = object

const AddProviderSheet = forwardRef<BottomSheetModal, AddProviderSheetProps>((props, ref) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = useIsDark()

  const [providerName, setProviderName] = useState('')
  const [selectedProviderType, setSelectedProviderType] = useState<ProviderType | undefined>(undefined)

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const handleAddProvider = async () => {
    try {
      const newProvider: Provider = {
        id: uuid(),
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
      snapPoints={['55%']}
      enableDynamicSizing={false}
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
      <BottomSheetView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
            <XStack width="100%" alignItems="center" justifyContent="center">
              <Text fontSize={24}>{t('settings.provider.add.title')}</Text>
            </XStack>
            <YStack width="100%" gap={24} justifyContent="center" alignItems="center">
              <AvatarEditButton
                content={<DefaultProviderIcon />}
                editIcon={<PenLine size={24} />}
                updateAvatar={async () => {}}
              />
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
                backgroundColor="$colorBrand"
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
