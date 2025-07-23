import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Stack, Text, useTheme, XStack, YStack } from 'tamagui'

import { UnionPlusIcon } from '@/components/icons/UnionPlusIcon'
import { SettingDivider } from '@/components/settings'
import { useNavigation } from '@/hooks/useNavigation'
import { saveAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { useIsDark, uuid } from '@/utils'
import { getGreenColor, getTextSecondaryColor } from '@/utils/color'
import { formateEmoji } from '@/utils/formats'

import GroupTag from './GroupTag'

interface AssistantItemSheetProps {
  assistant: Assistant | null
}

const AssistantItemSheet = forwardRef<BottomSheetModal, AssistantItemSheetProps>(({ assistant }, ref) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = useIsDark()
  const { navigateToChatScreen } = useNavigation()

  // 添加背景组件渲染函数
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const renderFooter = () => (
    <XStack bottom={25} justifyContent="space-between" alignItems="center" gap={10}>
      <Button chromeless circular icon={<UnionPlusIcon size={34} />} onPress={handleAddAssistant} />
      <Button
        backgroundColor="$foregroundGreen"
        borderRadius={40}
        paddingVertical={5}
        paddingHorizontal={10}
        flex={1}
        onPress={handleChatPress}>
        <Text color="white" fontSize={16} fontWeight="600">
          {t('assistants.market.button.chat')}
        </Text>
      </Button>
    </XStack>
  )

  const handleChatPress = async () => {
    if (assistant) {
      const newAssistant: Assistant = {
        ...assistant,
        id: uuid(),
        type: 'external'
      }
      await saveAssistant(newAssistant)
      const topic = await createNewTopic(newAssistant)
      navigateToChatScreen(topic.id)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }
  }

  const handleAddAssistant = async () => {
    if (assistant) {
      await saveAssistant({
        ...assistant,
        id: uuid(),
        type: 'external'
      })
    }
  }

  if (!assistant) return null

  return (
    <BottomSheetModal
      snapPoints={['85%']}
      enableDynamicSizing={false}
      ref={ref}
      style={{
        paddingHorizontal: 25
      }}
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val
      }}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <YStack flex={1} gap={17}>
          {/* Main Content */}
          <YStack flex={1} gap={25}>
            {/* Header with emoji and groups */}
            <YStack justifyContent="center" alignItems="center" gap={20} paddingVertical={20}>
              <Text fontSize={128} marginBottom={16}>
                {formateEmoji(assistant.emoji)}
              </Text>
              <Text fontSize={22} fontWeight="bold" textAlign="center">
                {assistant.name}
              </Text>
              {assistant.group && assistant.group.length > 0 && (
                <XStack gap={10} flexWrap="wrap" justifyContent="center">
                  {assistant.group.map((group, index) => (
                    <GroupTag
                      key={index}
                      group={group}
                      paddingHorizontal={12}
                      paddingVertical={5}
                      backgroundColor={getGreenColor(isDark, 10)}
                      color={getGreenColor(isDark, 100)}
                      borderWidth={0.5}
                      borderColor={getGreenColor(isDark, 20)}
                    />
                  ))}
                </XStack>
              )}
            </YStack>
            <Stack>
              <SettingDivider />
            </Stack>

            {/* Description */}
            {assistant.description && (
              <YStack>
                <Text lineHeight={20} color={getTextSecondaryColor(isDark)} numberOfLines={2} ellipsizeMode="tail">
                  {assistant.description}
                </Text>
              </YStack>
            )}

            {/* Additional details could go here */}
            {assistant.prompt && (
              <Text fontSize={16} lineHeight={20} numberOfLines={8} ellipsizeMode="tail">
                {assistant.prompt}
              </Text>
            )}
          </YStack>
        </YStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

AssistantItemSheet.displayName = 'AssistantItemSheet'

export default AssistantItemSheet
