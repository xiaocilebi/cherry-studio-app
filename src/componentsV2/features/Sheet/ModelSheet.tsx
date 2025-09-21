import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { sortBy } from 'lodash'
import debounce from 'lodash/debounce'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from 'heroui-native'

import { ModelIcon, ProviderIcon } from '@/componentsV2/icons'
import { BrushCleaning } from '@/componentsV2/icons/LucideIcon'
import { isEmbeddingModel, isRerankModel } from '@/config/models'
import { useBottom } from '@/hooks/useBottom'
import { useAllProviders } from '@/hooks/useProviders'
import { useTheme } from '@/hooks/useTheme'
import { Model } from '@/types/assistant'
import { getModelUniqId } from '@/utils/model'
import { ModelTags } from '@/componentsV2/features/ModelTags'
import YStack from '@/componentsV2/layout/YStack'
import XStack from '@/componentsV2/layout/XStack'
import { SearchInput } from '@/componentsV2/base/SearchInput'
import Text from '@/componentsV2/base/Text'
import { EmptyModelView } from '../SettingsScreen/EmptyModelView'

interface ModelSheetProps {
  mentions: Model[]
  setMentions: (mentions: Model[], isMultiSelectActive?: boolean) => Promise<void>
  multiple?: boolean
}

const ModelSheet = forwardRef<BottomSheetModal, ModelSheetProps>(({ mentions, setMentions, multiple }, ref) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [selectedModels, setSelectedModels] = useState<string[]>(() => mentions.map(m => getModelUniqId(m)))
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const insets = useSafeAreaInsets()
  const bottom = useBottom()
  const dimensions = useWindowDimensions()

  const debouncedSetQuery = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  const handleSearchChange = (text: string) => {
    setInputValue(text)
    debouncedSetQuery(text)
  }

  useEffect(() => {
    setSelectedModels(mentions.map(m => getModelUniqId(m)))
  }, [mentions])

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [ref, isVisible])

  const { providers } = useAllProviders()
  const selectOptions = providers
    .filter(p => p.models && p.models.length > 0 && p.enabled)
    .map(p => ({
      label: p.isSystem ? t(`provider.${p.id}`) : p.name,
      title: p.name,
      provider: p,
      options: sortBy(p.models, 'name')
        .filter(m => !isEmbeddingModel(m) && !isRerankModel(m))
        .filter(m => {
          if (!searchQuery) return true
          const query = searchQuery.toLowerCase()
          const modelId = getModelUniqId(m).toLowerCase()
          const modelName = m.name.toLowerCase()
          return modelId.includes(query) || modelName.includes(query)
        })
        .map(m => ({
          label: `${m.name}`,
          value: getModelUniqId(m),
          model: m
        }))
    }))
    .filter(group => group.options.length > 0)

  const allModelOptions = selectOptions.flatMap(group => group.options)

  const handleModelToggle = async (modelValue: string) => {
    const isSelected = selectedModels.includes(modelValue)
    let newSelection: string[]

    if (isMultiSelectActive) {
      // 多选模式
      if (!isSelected) {
        newSelection = [...selectedModels, modelValue]
      } else {
        newSelection = selectedModels.filter(id => id !== modelValue)
      }
    } else {
      // 单选模式
      if (!isSelected) {
        newSelection = [modelValue] // 只保留当前选中的
      } else {
        newSelection = [] // 取消选中
      }

      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    setSelectedModels(newSelection)

    const newMentions = allModelOptions
      .filter(option => newSelection.includes(option.value))
      .map(option => option.model)
    await setMentions(newMentions, isMultiSelectActive)
  }

  const handleClearAll = async () => {
    setSelectedModels([])
    await setMentions([])
  }

  const toggleMultiSelectMode = async () => {
    const newMultiSelectActive = !isMultiSelectActive
    setIsMultiSelectActive(newMultiSelectActive)

    // 如果切换到单选模式且当前有多个选择，只保留第一个
    if (!newMultiSelectActive && selectedModels.length > 1) {
      const firstSelected = selectedModels[0]
      setSelectedModels([firstSelected])
      const newMentions = allModelOptions.filter(option => option.value === firstSelected).map(option => option.model)
      await setMentions(newMentions)
    }
  }

  // 添加背景组件渲染函数
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  return (
    <BottomSheetModal
      enableDynamicSizing={true}
      ref={ref}
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
      }}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      topInset={insets.top}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'fillParent'}
      keyboardBlurBehavior="restore"
      maxDynamicContentSize={dimensions.height - 2 * insets.top}
      onDismiss={() => setIsVisible(false)}
      onChange={index => setIsVisible(index >= 0)}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: insets.bottom }}>
        <YStack className="gap-4 px-5 pb-5">
          <XStack className="gap-[5px] flex-1 items-center justify-center">
            <YStack className="flex-1">
              <SearchInput
                value={inputValue}
                onChangeText={handleSearchChange}
                placeholder={t('common.search_placeholder')}
              />
            </YStack>
            {multiple && (
              <Button
                size="sm"
                className={`rounded-full ${
                  isMultiSelectActive
                    ? 'bg-green-10 dark:bg-green-dark-10 border border-green-20 dark:border-green-dark-20'
                    : 'bg-ui-card dark:bg-ui-card-dark border border-transparent'
                }`}
                onPress={toggleMultiSelectMode}>
                <Button.LabelContent>
                  <Text
                    className={
                      isMultiSelectActive
                        ? 'text-green-100 dark:text-green-dark-100'
                        : 'text-text-primary dark:text-text-primary-dark'
                    }>
                    {t('button.multiple')}
                  </Text>
                </Button.LabelContent>
              </Button>
            )}
            {multiple && isMultiSelectActive && (
              <Button
                size="sm"
                className="rounded-full bg-ui-card dark:bg-ui-card-dark"
                isIconOnly
                onPress={handleClearAll}>
                <Button.LabelContent>
                  <BrushCleaning size={18} className="text-text-primary dark:text-text-primary-dark" />
                </Button.LabelContent>
              </Button>
            )}
          </XStack>
          {selectOptions.length === 0 ? (
            <EmptyModelView />
          ) : (
            selectOptions.map((group, groupIndex) => (
              <View key={group.title || group.label || groupIndex} className="gap-3">
                <XStack className="gap-3 items-center justify-start px-1">
                  <XStack className="w-8 h-8 rounded-lg items-center justify-center">
                    <ProviderIcon provider={group.provider} />
                  </XStack>
                  <Text className="text-[15px] font-bold text-gray-80 dark:text-gray-80">{group.label}</Text>
                </XStack>
                <YStack className="gap-1.5">
                  {group.options.map(item => (
                    <Button
                      size="sm"
                      key={item.value}
                      variant="ghost"
                      onPress={() => handleModelToggle(item.value)}
                      className={`justify-between px-2 rounded-lg border ${
                        selectedModels.includes(item.value)
                          ? 'border-green-20 dark:border-green-dark-20 bg-green-10 dark:bg-green-dark-10'
                          : 'border-transparent bg-transparent'
                      }`}>
                      <Button.LabelContent>
                        <XStack className="gap-2 flex-1 items-center justify-between w-full">
                          <XStack className="gap-2 flex-1 items-center max-w-[80%]">
                            {/* Model icon */}
                            <XStack className="justify-center items-center flex-shrink-0">
                              <ModelIcon model={item.model} />
                            </XStack>
                            {/* Model name */}
                            <Text
                              className={`flex-1 ${
                                selectedModels.includes(item.value)
                                  ? 'text-green-100 dark:text-green-dark-100'
                                  : 'text-text-primary dark:text-text-primary-dark'
                              }`}
                              numberOfLines={1}
                              ellipsizeMode="tail">
                              {item.label}
                            </Text>
                          </XStack>
                          <XStack className="gap-2 items-center flex-shrink-0">
                            {/* Model tags */}
                            <ModelTags model={item.model} size={11} />
                          </XStack>
                        </XStack>
                      </Button.LabelContent>
                    </Button>
                  ))}
                </YStack>
              </View>
            ))
          )}
        </YStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

ModelSheet.displayName = 'MentionSheet'

export default ModelSheet
