import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Assistant } from '@/types/assistant'

export function useAssistantSearch(assistants: Assistant[], delay = 300) {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  const debouncedSetSearch = useMemo(
    () =>
      debounce((text: string) => {
        setDebouncedSearchText(text)
      }, delay),
    [delay]
  )

  useEffect(() => {
    debouncedSetSearch(searchText)

    return () => {
      debouncedSetSearch.cancel()
    }
  }, [searchText, debouncedSetSearch])

  const filteredAssistants = useMemo(() => {
    if (!debouncedSearchText) {
      return assistants
    }

    const lowerSearchText = debouncedSearchText.toLowerCase().trim()

    if (!lowerSearchText) {
      return assistants
    }

    return assistants.filter(
      assistant =>
        (assistant.name && assistant.name.toLowerCase().includes(lowerSearchText)) ||
        (assistant.id && assistant.id.toLowerCase().includes(lowerSearchText))
    )
  }, [assistants, debouncedSearchText])

  const clearSearch = useCallback(() => {
    setSearchText('')
    setDebouncedSearchText('')
  }, [])

  return {
    searchText,
    setSearchText,
    filteredAssistants,
    isSearching: searchText !== debouncedSearchText,
    hasSearchText: !!debouncedSearchText,
    clearSearch
  }
}
