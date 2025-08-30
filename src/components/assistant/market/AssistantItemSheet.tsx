import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Settings2 } from '@tamagui/lucide-icons'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { Button, Stack, Text, useTheme, XStack, YStack } from 'tamagui'

import { UnionPlusIcon } from '@/components/icons/UnionPlusIcon'
import { SettingDivider } from '@/components/settings'
import { useCustomNavigation } from '@/hooks/useNavigation'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { saveAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { uuid } from '@/utils'
import { formateEmoji } from '@/utils/formats'

import GroupTag from './GroupTag'

interface AssistantItemSheetProps {
  assistant: Assistant | null
  source: 'builtIn' | 'external'
  onEdit?: (assistantId: string) => void
  actionButton?: {
    text: string
    onPress: () => void
  }
}

const AssistantItemSheet = forwardRef<BottomSheetModal, AssistantItemSheetProps>(
  ({ assistant, source, onEdit, actionButton }, ref) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const { isDark } = useCustomTheme()
    const { navigateToChatScreen } = useCustomNavigation()

    // 添加背景组件渲染函数
    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    )

    const handleChatPress = async () => {
      if (assistant) {
        let newAssistant: Assistant

        if (assistant.type === 'external') {
          newAssistant = assistant
        } else {
          newAssistant = {
            ...assistant,
            id: uuid(),
            type: 'external'
          }
          await saveAssistant(newAssistant)
        }

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
        Alert.alert(t('assistants.market.add.success', { assistant_name: assistant.name }))
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      }
    }

    const handleEditAssistant = async () => {
      if (!assistant || !onEdit) return
      onEdit(assistant.id)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
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
        backdropComponent={renderBackdrop}>
        <YStack flex={1}>
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }} // Add padding at the bottom to ensure content isn't hidden behind footer
          >
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
                          backgroundColor="$green10"
                          color="$green100"
                          borderWidth={0.5}
                          borderColor="$green20"
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
                    <Text lineHeight={20} color="$textSecondary" numberOfLines={2} ellipsizeMode="tail">
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

          {/* Footer positioned absolutely at the bottom */}
          <XStack
            position="absolute"
            bottom={20}
            left={0}
            right={0}
            padding={0}
            justifyContent="space-between"
            alignItems="center"
            gap={15}
            backgroundColor="$backgroundPrimary">
            {source === 'builtIn' && (
              <Button
                chromeless
                circular
                size="$5"
                icon={<UnionPlusIcon size={30} color="$textPrimary" />}
                onPress={handleAddAssistant}
              />
            )}
            {source === 'external' && (
              <Button
                chromeless
                circular
                size="$5"
                icon={<Settings2 size={30} color="$textPrimary" />}
                onPress={handleEditAssistant}
              />
            )}
            <Button
              backgroundColor="$green10"
              borderColor="$green20"
              borderRadius={30}
              paddingVertical={10}
              paddingHorizontal={20}
              flex={1}
              pressStyle={{ opacity: 0.85 }}
              onPress={actionButton?.onPress || handleChatPress}>
              <Text color="$green100" fontSize={17} fontWeight="700">
                {actionButton?.text || t('assistants.market.button.chat')}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </BottomSheetModal>
    )
  }
)

AssistantItemSheet.displayName = 'AssistantItemSheet'

export default AssistantItemSheet
