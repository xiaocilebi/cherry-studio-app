import React from 'react'

import TextField from '../TextField'
import { Search } from '@/componentsV2/icons'

interface SearchInputProps {
  placeholder: string
  onChangeText?: (text: string) => void
  value?: string
}

export const SearchInput = ({ placeholder, onChangeText, value }: SearchInputProps) => {
  return (
    <TextField>
      <TextField.Input
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        className="w-full h-10 rounded-lg bg-transparent text-base leading-5"
      >
        <TextField.InputStartContent>
          <Search size={20} className="text-text-secondary dark:text-text-secondary-dark " />
        </TextField.InputStartContent>

      </TextField.Input>
    </TextField>
  )
}

export default SearchInput
