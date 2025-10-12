import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Plus } from '@/componentsV2/icons/LucideIcon'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { SafeAreaContainer, Container, HeaderBar, SearchInput, Group } from '@/componentsV2'
import { useAllProviders } from '@/hooks/useProviders'
import { useSearch } from '@/hooks/useSearch'
import { Provider } from '@/types/assistant'
import { AddProviderSheet } from '@/componentsV2/features/SettingsScreen/AddProviderSheet'
import { ProviderItem } from '@/componentsV2/features/SettingsScreen/ProviderItem'
import { LegendList } from '@legendapp/list'

export default function ProviderListScreen() {
  const { t } = useTranslation()

  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { providers, isLoading } = useAllProviders()

  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [editingProvider, setEditingProvider] = useState<Provider | undefined>(undefined)

  const {
    searchText,
    setSearchText,
    filteredItems: filteredProviders
  } = useSearch(
    providers,
    useCallback((provider: Provider) => [provider.name || ''], []),
    { delay: 100 }
  )

  const onAddProvider = () => {
    setSheetMode('add')
    setEditingProvider(undefined)
    bottomSheetRef.current?.present()
  }

  const onEditProvider = (provider: Provider) => {
    setSheetMode('edit')
    setEditingProvider(provider)
    bottomSheetRef.current?.present()
  }

  const renderProviderItem = ({ item }: { item: Provider }) => (
    <ProviderItem provider={item} mode={item.enabled ? 'enabled' : 'checked'} onEdit={onEditProvider} />
  )

  return (
    <SafeAreaContainer>
      <HeaderBar
        title={t('settings.provider.list.title')}
        rightButton={{
          icon: <Plus size={24} />,
          onPress: onAddProvider
        }}
      />
      {isLoading ? (
        <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </SafeAreaContainer>
      ) : (
        <Container className="pb-0 gap-4">
          <SearchInput placeholder={t('settings.provider.search')} value={searchText} onChangeText={setSearchText} />

          <Group className="flex-1">
            <LegendList
              data={filteredProviders}
              renderItem={renderProviderItem}
              keyExtractor={item => item.id}
              estimatedItemSize={60}
              showsVerticalScrollIndicator={false}
              extraData={filteredProviders}
              contentContainerStyle={{ paddingBottom: 30 }}
              drawDistance={2000}
              recycleItems
            />
          </Group>
        </Container>
      )}

      <AddProviderSheet ref={bottomSheetRef} mode={sheetMode} editProvider={editingProvider} />
    </SafeAreaContainer>
  )
}
