import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet'
import { LegendList } from '@legendapp/list'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { BackHandler, TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { haptic } from '@/utils/haptic'
import { Check } from '@/componentsV2/icons'
import Text from '../Text'
import XStack from '@/componentsV2/layout/XStack'
import YStack from '@/componentsV2/layout/YStack'
import { cn } from 'heroui-native'

export interface SelectionSheetItem {
  label: React.ReactNode | string
  description?: React.ReactNode | string
  icon?: React.ReactNode | ((isSelected: boolean) => React.ReactNode)
  isSelected?: boolean
  backgroundColor?: string
  color?: string
  onSelect?: () => void
  [x: string]: any
}

export interface SelectionSheetProps {
  items: SelectionSheetItem[]
  emptyContent?: React.ReactNode
  snapPoints?: string[]
  ref: React.RefObject<BottomSheetModal | null>
  placeholder?: string
}

/**
 * 用于在BottomSheetModal中显示列表
 */

const SelectionSheet: React.FC<SelectionSheetProps> = ({ items, emptyContent, snapPoints = [], ref, placeholder }) => {
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  // Link LegendList with BottomSheet gestures
  const BottomSheetLegendListScrollable = useBottomSheetScrollableCreator()


  useEffect(() => {
    if (!isVisible || !ref?.current) return

    const backAction = () => {
      ref.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [ref, isVisible])

  const handleSelect = (item: SelectionSheetItem) => {
    ref.current?.dismiss()
    haptic(ImpactFeedbackStyle.Medium)
    item.onSelect?.()
  }

  const renderItem = ({ item }: { item: SelectionSheetItem }) => {
    const iconElement = typeof item.icon === 'function' ? item.icon(item.isSelected ?? false) : item.icon
    const labelElement =
      typeof item.label === 'string' ? (
        <Text
          className={cn(`text-base ${item.isSelected ? 'text-green-100 dark:text-green-dark-100' : 'text-text-primary dark:text-text-primary-dark'}`,item.color&& !item.isSelected ?  item.color  : undefined)}
          >
          {item.label}
        </Text>
      ) : (
        item.label
      )
    const descriptionElement =
      typeof item.description === 'string' ? (
        <Text
          className={cn(`text-[11px] opacity-70 flex-1 ${item.isSelected ? 'text-green-100 dark:text-green-dark-100' : 'text-text-secondary dark:text-text-secondary-dark'}`,item.color&& !item.isSelected ?  item.color  : undefined)}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.description}
        </Text>
      ) : (
        item.description
      )
    return (
      <TouchableOpacity onPress={() => handleSelect(item)} activeOpacity={0.5}>
        <XStack
          className={cn(`items-center gap-2.5 px-3.5 py-3 rounded-lg border ${
            item.isSelected
              ? 'border-green-20 bg-green-10 dark:border-green-dark-20 dark:bg-green-dark-10'
              : 'border-transparent bg-ui-card-background dark:bg-ui-card-background-dark'
          }`, item.backgroundColor && !item.isSelected ? item.backgroundColor  : undefined)}>
          {iconElement}
          <XStack className="flex-1 gap-2.5 items-center justify-between">
            {labelElement}
            {descriptionElement}
          </XStack>
          {item.isSelected && <Check size={20} className="text-green-100 dark:text-green-dark-100" />}
        </XStack>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item: SelectionSheetItem, index: number) =>
    item.key?.toString() || item.id?.toString() || item.label?.toString() || index.toString()

  if (items.length === 0 && emptyContent) {
    return <YStack className="pb-7 px-4 gap-2.5">{emptyContent}</YStack>
  }

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )


  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={snapPoints.length === 0}
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
      }}
      backdropComponent={renderBackdrop}
      onDismiss={() => setIsVisible(false)}
      onChange={index => setIsVisible(index >= 0)}>
      <LegendList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={60}
        ItemSeparatorComponent={() => <YStack className="h-2.5" />}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        renderScrollComponent={BottomSheetLegendListScrollable}
        drawDistance={1000}
        ListHeaderComponent={
          placeholder ? (
            <View className="px-4 pb-2">
              <Text className="text-sm text-text-secondary dark:text-text-secondary-dark text-center opacity-60">
                {placeholder}
              </Text>
            </View>
          ) : undefined
        }
        recycleItems
      />
    </BottomSheetModal>
  )
}

export default SelectionSheet
