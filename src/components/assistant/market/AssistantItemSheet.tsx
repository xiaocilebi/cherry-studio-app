import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Button, Text, useTheme, XStack, YStack } from 'tamagui'

import { UnionPlusIcon } from '@/components/icons/UnionPlusIcon'
import { useSize } from '@/hooks/useSize'
import { Assistant } from '@/types/assistant'

import GroupTag from './GroupTag'

interface AssistantItemSheetProps {
  assistant: Assistant
  bottomSheetRef: React.RefObject<BottomSheet | null>
  isOpen: boolean
  onClose: () => void
}

export default function AssistantItemSheet({ assistant, bottomSheetRef, isOpen, onClose }: AssistantItemSheetProps) {
  const { t } = useTranslation()
  const snapPoints = ['75%']
  const { height } = useSize()
  const theme = useTheme()

  const footerComponent = () => {
    return (
      <XStack justifyContent="space-between">
        <UnionPlusIcon size={34} />
        <Button backgroundColor="$foregroundGreen" borderRadius={40} height={42} width="70%">
          {t('assistants.market.button.chat')}
        </Button>
      </XStack>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModal footerComponent={footerComponent}>
        <YStack>
          <YStack justifyContent="center" alignItems="center" paddingVertical={10} top={0}>
            <Text fontSize={84}>{assistant.emoji?.replace(/\r\n/g, '')}</Text>
            <XStack gap={20}>
              {assistant.group &&
                assistant.group.map((group, index) => (
                  <GroupTag key={index} group={group} paddingHorizontal={16} borderWidth={1} borderColor="$color12" />
                ))}
            </XStack>
          </YStack>
        </YStack>
      </BottomSheetModal>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200
  },
  contentContainer: {
    backgroundColor: 'white'
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee'
  }
})
