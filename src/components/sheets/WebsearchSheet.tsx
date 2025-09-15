import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { ChevronRight } from '@tamagui/lucide-icons'
import { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { Text, XStack } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { WebSearchProvider } from '@/types/websearch'

import { SettingHelpText } from '../settings'
import SelectionSheet, { SelectionSheetItem } from '../ui/SelectionSheet'
import { WebsearchProviderIcon } from '../ui/WebsearchIcon'

interface WebsearchSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  providers: WebSearchProvider[]
  ref: React.RefObject<BottomSheetModal | null>
}

const WebsearchSheet: FC<WebsearchSheetProps> = ({ providers, assistant, updateAssistant, ref }) => {
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
      <XStack
        width="100%"
        alignItems="center"
        gap={10}
        paddingHorizontal={20}
        paddingVertical={16}
        borderRadius={16}
        backgroundColor="$uiCardBackground">
        <Text color="$textPrimary" fontSize={16} flex={1}>
          {t('settings.websearch.empty')}
        </Text>
        <XStack alignItems="center" gap={5}>
          <SettingHelpText>{t('settings.websearch.empty.description')}</SettingHelpText>
          <ChevronRight size={16} color="$textSecondary" />
        </XStack>
      </XStack>
    </TouchableOpacity>
  )

  return <SelectionSheet items={providerItems} ref={ref} emptyContent={emptyContent} />
}

export default WebsearchSheet
