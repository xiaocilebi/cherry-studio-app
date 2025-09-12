import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

export interface SelectionListItem {
  id: string
  name: string
  icon?: React.ReactNode | ((isSelected: boolean) => React.ReactNode)
  isSelected?: boolean
  onSelect?: () => void
}

export interface SelectionListProps {
  items: SelectionListItem[]
  emptyContent?: React.ReactNode
}

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
          <TouchableOpacity key={item.id} onPress={() => item.onSelect?.()} activeOpacity={0.7}>
            <XStack
              width="100%"
              alignItems="center"
              gap={10}
              paddingHorizontal={20}
              paddingVertical={16}
              borderRadius={16}
              borderWidth={1}
              borderColor={item.isSelected ? '$green20' : 'transparent'}
              backgroundColor={item.isSelected ? '$green10' : '$uiCardBackground'}>
              {iconElement}
              <Text color={item.isSelected ? '$green100' : '$textPrimary'} fontSize={16} flex={1}>
                {item.name}
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
