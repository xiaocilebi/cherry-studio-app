import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { WebSearchProvider } from '@/types/websearch'

import { WebsearchProviderIcon } from '@/componentsV2/icons'
import SelectionSheet, { SelectionSheetItem } from '@/componentsV2/base/SelectionSheet'
import XStack from '@/componentsV2/layout/XStack'
import Text from '@/componentsV2/base/Text'
import RowRightArrow from '@/componentsV2/layout/Row/RowRightArrow'

interface WebsearchSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  providers: WebSearchProvider[]
  ref: React.RefObject<BottomSheetModal | null>
}

export const WebsearchSheet: FC<WebsearchSheetProps> = ({ providers, assistant, updateAssistant, ref }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()

  const handleItemSelect = async (id: string) => {
    const newProviderId = id === assistant.webSearchProviderId ? undefined : id
    await updateAssistant({
      ...assistant,
      webSearchProviderId: newProviderId
    })
    ref.current?.dismiss()
  }

  const handleNavigateToWebSearhPage = () => {
    ref.current?.dismiss()
    navigation.navigate('Home', { screen: 'WebSearchSettings' })
  }

  const providerItems: SelectionSheetItem[] = providers.map(p => ({
    id: p.id,
    label: p.name,
    icon: <WebsearchProviderIcon provider={p} />,
    isSelected: assistant.webSearchProviderId === p.id,
    onSelect: () => handleItemSelect(p.id)
  }))

  const emptyContent = (
    <TouchableOpacity onPress={handleNavigateToWebSearhPage} activeOpacity={0.7}>
      <XStack className="w-full items-center gap-2.5 px-5 py-4 rounded-2xl bg-card">
        <Text className="text-foreground text-base flex-1">{t('settings.websearch.empty')}</Text>
        <XStack className="items-center gap-1.5">
          <Text className="text-[11px] opacity-40">{t('settings.websearch.empty.description')}</Text>
          <RowRightArrow />
        </XStack>
      </XStack>
    </TouchableOpacity>
  )

  return <SelectionSheet items={providerItems} ref={ref} emptyContent={emptyContent} />
}
