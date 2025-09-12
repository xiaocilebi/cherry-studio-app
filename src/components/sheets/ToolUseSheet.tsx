import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { SquareFunction, Wrench } from '@tamagui/lucide-icons'
import { forwardRef, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'
import { Assistant } from '@/types/assistant'

import SelectionList, { SelectionListItem } from '../ui/SelectionList'

interface ToolUseSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

const ToolUseSheet = forwardRef<BottomSheetModal, ToolUseSheetProps>(({ assistant, updateAssistant }, ref) => {
  const { isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  const toolUseOptions: SelectionListItem[] = [
    {
      id: 'function',
      label: t('assistants.settings.tooluse.function'),
      icon: (isSelected: boolean) => <SquareFunction size={20} color={isSelected ? '$green100' : '$textPrimary'} />,
      isSelected: assistant.settings?.toolUseMode === 'function',
      onSelect: () => handleToolUseModeToggle('function')
    },
    {
      id: 'prompt',
      label: t('assistants.settings.tooluse.prompt'),
      icon: (isSelected: boolean) => <Wrench size={20} color={isSelected ? '$green100' : '$textPrimary'} />,
      isSelected: assistant.settings?.toolUseMode === 'prompt',
      onSelect: () => handleToolUseModeToggle('prompt')
    }
  ]

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const handleToolUseModeToggle = async (mode: 'function' | 'prompt') => {
    const newToolUseMode = mode === assistant.settings?.toolUseMode ? undefined : mode
    await updateAssistant({
      ...assistant,
      settings: {
        ...assistant.settings,
        toolUseMode: newToolUseMode
      }
    })
    ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
  }

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
      snapPoints={['25%']}
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
        <SelectionList items={toolUseOptions} />
      </BottomSheetView>
    </BottomSheetModal>
  )
})

export default ToolUseSheet
