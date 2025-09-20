import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from 'heroui-native'
import { useTheme } from '@/hooks/useTheme'
import { loggerService } from '@/services/LoggerService'
import { Model, Provider } from '@/types/assistant'
import { getDefaultGroupName } from '@/utils/naming'
import YStack from '@/componentsV2/layout/YStack'
import Text from '@/componentsV2/base/Text'
import XStack from '@/componentsV2/layout/XStack'

const logger = loggerService.withContext('AddModelSheet')

interface AddModelSheetProps {
  provider?: Provider
  updateProvider: (provider: Provider) => Promise<void>
}

export const AddModelSheet = forwardRef<BottomSheetModal, AddModelSheetProps>(({ provider, updateProvider }, ref) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const [modelId, setModelId] = useState('')
  const [modelName, setModelName] = useState('')
  const [modelGroup, setModelGroup] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    setModelName(modelId)
    setModelGroup(getDefaultGroupName(modelId, provider?.id))
  }, [modelId, provider?.id])

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [ref, isVisible])

  const handleAddModel = async () => {
    if (!provider || !modelId.trim()) {
      logger.warn('Provider not available or Model ID is required.')
      return
    }

    if (provider.models.some(model => model.id === modelId.trim())) {
      logger.warn('Model ID already exists.', { modelId: modelId.trim() })
      return
    }

    const newModel: Model = {
      id: modelId,
      provider: provider.id,
      name: modelName,
      group: modelGroup
    }

    const updatedProvider: Provider = {
      ...provider,
      models: [...provider.models, newModel]
    }

    try {
      await updateProvider(updatedProvider)
      logger.info('Successfully added model:', newModel)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    } catch (error) {
      logger.error('Failed to add model:', error)
    } finally {
      setModelId('')
      setModelName('')
      setModelGroup('')
    }
  }

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const inputStyle = {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: isDark ? '#19191C' : '#ffffffff',
    borderWidth: 0.5,
    borderColor: '#a0a1b066',
    color: isDark ? '#f9f9f9ff' : '#202020ff'
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
        backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
      }}
      backdropComponent={renderBackdrop}
      onDismiss={() => setIsVisible(false)}
      onChange={index => setIsVisible(index >= 0)}>
      <BottomSheetView style={{ paddingBottom: insets.bottom }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack className="items-center pb-7 px-5 gap-2.5">
            <XStack className="w-full items-center justify-center">
              <Text className="text-xl">{t('settings.models.add.model')}</Text>
            </XStack>
            <YStack className="w-full gap-6 justify-center items-center ">
              {/* Model ID Input */}
              <YStack className="w-full gap-2">
                <XStack className="gap-2 px-3">
                  <Text className="text-text-secondary dark:text-text-secondary-dark">{t('settings.models.add.model.id')}</Text>
                  <Text size='lg' className="text-red-500 dark:text-red-500">*</Text>
                </XStack>
                <BottomSheetTextInput
                  style={inputStyle}
                  placeholder={t('settings.models.add.model.id.placeholder')}
                  value={modelId}
                  onChangeText={setModelId}
                />
              </YStack>
              {/* Model Name Input */}
              <YStack className="w-full gap-2">
                <XStack className="gap-2 px-3">
                  <Text className="text-text-secondary dark:text-text-secondary-dark">{t('settings.models.add.model.name')}</Text>
                </XStack>
                <BottomSheetTextInput
                  style={inputStyle}
                  placeholder={t('settings.models.add.model.name.placeholder')}
                  value={modelName}
                  onChangeText={setModelName}
                />
              </YStack>
              {/* Model Group Input */}
              <YStack className="w-full gap-2">
                <XStack className="gap-2 px-3">
                  <Text className="text-text-secondary dark:text-text-secondary-dark">{t('settings.models.add.model.group')}</Text>
                </XStack>
                <BottomSheetTextInput
                  style={inputStyle}
                  placeholder={t('settings.models.add.model.group.placeholder')}
                  value={modelGroup}
                  onChangeText={setModelGroup}
                />
              </YStack>
              <Button
                variant='tertiary'
                className="h-11 w-4/6 rounded-2xl bg-green-10 border-green-20 dark:bg-green-dark-10 dark:border-green-dark-20"
                onPress={handleAddModel}
                isDisabled={!modelId.trim()}>
                <Button.LabelContent ><Text className='text-green-100 dark:text-green-dark-100'>{t('settings.models.add.model')}</Text></Button.LabelContent>
              </Button>
            </YStack>
          </YStack>
        </TouchableWithoutFeedback>
      </BottomSheetView>
    </BottomSheetModal>
  )
})
AddModelSheet.displayName="AddModelSheet"
