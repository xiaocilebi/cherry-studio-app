import { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { Check } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { BackHandler, TouchableOpacity } from 'react-native'
import { Text, View, XStack, YStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { haptic } from '@/utils/haptic'

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
        <Text color={item.isSelected ? '$green100' : (item.color ?? '$textPrimary')} fontSize={16}>
          {item.label}
        </Text>
      ) : (
        item.label
      )
    const descriptionElement =
      typeof item.description === 'string' ? (
        <Text
          color={item.isSelected ? '$green100' : (item.color ?? '$textSecondary')}
          opacity={0.7}
          fontSize={11}
          flex={1}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.description}
        </Text>
      ) : (
        item.description
      )
    return (
      <TouchableOpacity onPress={() => handleSelect(item)} activeOpacity={0.7}>
        <XStack
          alignItems="center"
          gap={10}
          paddingHorizontal={14}
          paddingVertical={12}
          borderRadius={16}
          borderWidth={1}
          borderColor={item.isSelected ? '$green20' : 'transparent'}
          backgroundColor={item.isSelected ? '$green10' : (item.backgroundColor ?? '$uiCardBackground')}>
          {iconElement}
          <XStack flex={1} gap={10} alignItems="center" justifyContent="space-between">
            {labelElement}
            {descriptionElement}
          </XStack>
          {item.isSelected && <Check size={20} color="$green100" />}
        </XStack>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item: SelectionSheetItem, index: number) =>
    item.key?.toString() || item.id?.toString() || item.label?.toString() || index.toString()

  if (items.length === 0 && emptyContent) {
    return (
      <YStack paddingBottom={30} paddingHorizontal={16} gap={10}>
        {emptyContent}
      </YStack>
    )
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
      {placeholder && (
        <View paddingHorizontal={16} paddingBottom={8}>
          <Text fontSize={14} color="$textSecondary" textAlign="center" opacity={0.6}>
            {placeholder}
          </Text>
        </View>
      )}
      <BottomSheetFlashList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={60}
        ItemSeparatorComponent={() => <YStack height={10} />}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      />
    </BottomSheetModal>
  )
}

export default SelectionSheet
