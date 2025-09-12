import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { forwardRef, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'

import { useTheme } from '@/hooks/useTheme'
import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { WebSearchProvider } from '@/types/websearch'

import { SettingHelpText } from '../settings'
import SelectionList, { SelectionListItem } from '../ui/SelectionList'
import { WebsearchProviderIcon } from '../ui/WebsearchIcon'

interface WebsearchSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  providers: WebSearchProvider[]
}

const WebsearchSheet = forwardRef<BottomSheetModal, WebsearchSheetProps>(
  ({ providers, assistant, updateAssistant }, ref) => {
    const { isDark } = useTheme()
    const { t } = useTranslation()
    const navigation = useNavigation<DrawerNavigationProps>()
    const insets = useSafeAreaInsets()
    const [isVisible, setIsVisible] = useState(false)

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    )

    const handleItemSelect = async (id: string) => {
      const newProviderId = id === assistant.webSearchProviderId ? undefined : id
      await updateAssistant({
        ...assistant,
        webSearchProviderId: newProviderId
      })
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    const handleNavigateToWebSearhPage = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      navigation.navigate('Home', { screen: 'WebSearchSettings' })
    }

    const providerItems: SelectionListItem[] = providers.map(p => ({
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

    useEffect(() => {
      if (!isVisible) return

      const backAction = () => {
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }, [ref, isVisible])

    return (
      <BottomSheetModal
        snapPoints={['30%']}
        enableDynamicSizing={true}
        ref={ref}
        backgroundStyle={{
          borderRadius: 30,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
        }}
        backdropComponent={renderBackdrop}
        onDismiss={() => setIsVisible(false)}
        onChange={index => setIsVisible(index >= 0)}>
        <BottomSheetView style={{ paddingBottom: insets.bottom }}>
          <SelectionList items={providerItems} emptyContent={emptyContent} />
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default WebsearchSheet
