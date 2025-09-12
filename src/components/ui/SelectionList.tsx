import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

export interface SelectionListItem {
  label: React.ReactNode | string
  icon?: React.ReactNode | ((isSelected: boolean) => React.ReactNode)
  isSelected?: boolean
  backgroundColor?: string
  color?: string
  onSelect?: () => void
  [x: string]: any
}

export interface SelectionListProps {
  items: SelectionListItem[]
  emptyContent?: React.ReactNode
}

/**
 * 用于在BottomSheetModal中显示列表
 */

const SelectionList: React.FC<SelectionListProps> = ({ items, emptyContent }) => {
  if (items.length === 0 && emptyContent) {
    return (
      <YStack paddingBottom={30} paddingHorizontal={16} gap={10}>
        {emptyContent}
      </YStack>
    )
  }

  return (
    <YStack paddingBottom={30} paddingHorizontal={16} gap={10}>
      {items.map(item => {
        const iconElement = typeof item.icon === 'function' ? item.icon(item.isSelected ?? false) : item.icon
        return (
          <TouchableOpacity key={item.key || item.label} onPress={() => item.onSelect?.()} activeOpacity={0.7}>
            <XStack
              width="100%"
              alignItems="center"
              gap={10}
              paddingHorizontal={20}
              paddingVertical={16}
              borderRadius={16}
              borderWidth={1}
              borderColor={item.isSelected ? '$green20' : 'transparent'}
              backgroundColor={item.isSelected ? '$green10' : (item.backgroundColor ?? '$uiCardBackground')}>
              {iconElement}
              <Text color={item.isSelected ? '$green100' : (item.color ?? '$textPrimary')} fontSize={16} flex={1}>
                {item.label}
              </Text>
              {item.isSelected && <Check size={20} color="$green100" />}
            </XStack>
          </TouchableOpacity>
        )
      })}
    </YStack>
  )
}

export default SelectionList
