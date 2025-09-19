import React from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'

import { ChevronRight } from '@/componentsV2/icons/LucideIcon'
import XStack from '@/componentsV2/layout/XStack'
import Text from '../Text'

interface SelectOptionItem<T = any> {
  label: string
  value: string
  data?: T
}

interface SelectOptionGroup<T = any> {
  label: string
  title?: string
  options: SelectOptionItem<T>[]
}

interface SelectProps<T = any> {
  value: string | undefined
  onValueChange: (value: string, item?: SelectOptionItem<T>) => void
  selectOptions: SelectOptionGroup<T>[]
  placeholder: string
  width?: string | number
  className?: string
}

export function Select<T = any>({
  value,
  onValueChange,
  selectOptions,
  placeholder,
  className
}: SelectProps<T>) {
  const findSelectedItem = (selectedValue: string): SelectOptionItem<T> | undefined => {
    for (const group of selectOptions) {
      const item = group.options.find(option => option.value === selectedValue)
      if (item) return item
    }

    return undefined
  }

  const handleValueChange = (newValue: string) => {
    const selectedItem = findSelectedItem(newValue)
    onValueChange(newValue, selectedItem)
  }

  const [selectedDisplayInfo, setSelectedDisplayInfo] = React.useState<{
    groupLabel: string
    itemLabel: string
  } | null>(null)

  React.useEffect(() => {
    if (value) {
      for (const group of selectOptions) {
        const item = group.options.find(option => option.value === value)

        if (item) {
          setSelectedDisplayInfo({ groupLabel: group.label, itemLabel: item.label })
          return
        }
      }
    }

    setSelectedDisplayInfo(null)
  }, [value, selectOptions])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <XStack
          className={`h-[46px] w-full py-3 px-4 items-center justify-between gap-2.5 rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark ${className || ''}`}
          >
          <XStack className="flex-1 items-center overflow-hidden justify-between">
            {selectedDisplayInfo ? (
              <>
                <Text className="flex-shrink text-text-primary dark:text-text-primary-dark" numberOfLines={1} ellipsizeMode="tail">
                  {selectedDisplayInfo.groupLabel}
                </Text>
                <Text className="flex-shrink-0 max-w-[60%] text-text-primary dark:text-text-primary-dark" numberOfLines={1} ellipsizeMode="tail">
                  {selectedDisplayInfo.itemLabel}
                </Text>
              </>
            ) : (
              <Text className="flex-1 text-text-secondary dark:text-text-secondary-dark" numberOfLines={1} ellipsizeMode="tail">
                {placeholder}
              </Text>
            )}
          </XStack>
          <ChevronRight size={16} className="text-text-secondary dark:text-text-secondary-dark opacity-90 -mr-1" />
        </XStack>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {selectOptions.map((group, groupIndex) => (
          <DropdownMenu.Group key={group.title || group.label || groupIndex}>
            {group.label && group.label.trim() !== '' && <DropdownMenu.Label>{group.label}</DropdownMenu.Label>}
            {group.options.map(item => (
              <DropdownMenu.Item key={item.value} onSelect={() => handleValueChange(item.value)}>
                <DropdownMenu.ItemTitle>{item.label}</DropdownMenu.ItemTitle>
                {value === item.value && (
                  <DropdownMenu.ItemIcon
                    ios={{
                      name: 'checkmark',
                      pointSize: 16
                    }}
                  />
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
