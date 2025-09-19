import React from 'react'

import { WebSearchProvider } from '@/types/websearch'
import { Select } from '@/componentsV2'

interface SelectOptionItem {
  label: string
  value: string
}

interface SelectOptionGroup {
  label: string
  title?: string
  options: SelectOptionItem[]
}

interface WebSearchSelectProps {
  value: string | undefined
  onValueChange: (value: string) => void
  selectOptions: SelectOptionGroup[]
  placeholder: string
}

export function WebSearchSelect({ value, onValueChange, selectOptions, placeholder }: WebSearchSelectProps) {
  const handleValueChange = (newValue: string, item?: SelectOptionItem) => {
    onValueChange(newValue)
    // 如果需要访问完整的模型信息，可以使用 item?.model
  }

  return (
    <Select<WebSearchProvider>
      value={value}
      onValueChange={handleValueChange}
      selectOptions={selectOptions}
      placeholder={placeholder}
    />
  )
}
