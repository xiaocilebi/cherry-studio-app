import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import { Settings2 } from '@tamagui/lucide-icons'
import { BlurView } from 'expo-blur'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler } from 'react-native'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Stack, Text, View, XStack, YStack } from 'tamagui'

import { UnionPlusIcon } from '@/components/icons/UnionPlusIcon'
import { SettingDivider } from '@/components/settings'
import { ModelIcon } from '@/components/ui/ModelIcon'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { saveAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { uuid } from '@/utils'
import { formateEmoji } from '@/utils/formats'
import { haptic } from '@/utils/haptic'

import EmojiAvatar from '../EmojiAvator'
import GroupTag from './GroupTag'

interface AssistantItemSheetProps {
  assistant: Assistant | null
  source: 'builtIn' | 'external'
  onEdit?: (assistantId: string) => void
  onChatNavigation?: (topicId: string) => Promise<void>
  actionButton?: {
    text: string
    onPress: () => void
  }
}

const AssistantItemSheet = forwardRef<BottomSheetModal, AssistantItemSheetProps>(
  ({ assistant, source, onEdit, onChatNavigation, actionButton }, ref) => {
    const { t } = useTranslation()
    const { isDark } = useCustomTheme()
    const { bottom } = useSafeAreaInsets()
    const toast = useToast()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      if (!isVisible) return

      const backAction = () => {
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }, [ref, isVisible])

    // 添加背景组件渲染函数
    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    )

    const handleChatPress = async () => {
      if (!assistant || !onChatNavigation) return

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
      await onChatNavigation(topic.id)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    const handleAddAssistant = async () => {
      if (assistant) {
        await saveAssistant({
          ...assistant,
          id: uuid(),
          type: 'external'
        })
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        haptic(ImpactFeedbackStyle.Medium)
        toast.show(t('assistants.market.add.success', { assistant_name: assistant.name }))
      }
    }

    const handleEditAssistant = async () => {
      if (!assistant || !onEdit) return
      onEdit(assistant.id)
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    return (
      <BottomSheetModal
        snapPoints={['80%']}
        enableDynamicSizing={false}
        ref={ref}
        backgroundStyle={{
          borderRadius: 30,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        handleComponent={() => null}
        backdropComponent={renderBackdrop}
        onDismiss={() => setIsVisible(false)}
        onChange={index => setIsVisible(index >= 0)}>
        {!assistant ? null : (
          <YStack flex={1} gap={17}>
            {/* 背景模糊emoji */}
            <View
              borderRadius={30}
              top={0}
              left={0}
              right={0}
              overflow="hidden"
              position="absolute"
              alignItems="center"
              justifyContent="center"
              scale={3}
              transformOrigin="center center">
              <Text fontSize={140} opacity={0.1}>
                {formateEmoji(assistant.emoji)}
              </Text>
            </View>
            {/* BlurView模糊层 */}
            <BlurView
              intensity={Platform.OS === 'android' ? 60 : 80}
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                borderRadius: 30
              }}
            />

            {/* Main Content */}
            <YStack flex={1} gap={25} paddingHorizontal={25}>
              {/* Header with emoji and groups */}
              <YStack justifyContent="center" alignItems="center" gap={20}>
                <View marginTop={20}>
                  <EmojiAvatar
                    emoji={assistant.emoji}
                    size={120}
                    borderWidth={5}
                    borderColor={isDark ? '#333333' : '$uiCardBackground'}
                  />
                </View>
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
                {assistant.defaultModel && (
                  <XStack gap={2} alignItems="center" justifyContent="center">
                    <ModelIcon model={assistant.defaultModel} size={14} />
                    <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail">
                      {assistant.defaultModel.name}
                    </Text>
                  </XStack>
                )}
              </YStack>

              <Stack>
                <SettingDivider />
              </Stack>

              {/* Description */}
              {assistant.description && (
                <YStack gap={5}>
                  <Text lineHeight={20} fontSize={18} fontWeight="bold" color="$textPrimary">
                    {t('common.description')}
                  </Text>
                  <Text lineHeight={20} color="$textSecondary" numberOfLines={2} ellipsizeMode="tail">
                    {assistant.description}
                  </Text>
                </YStack>
              )}

              {/* Additional details could go here */}
              {assistant.prompt && (
                <YStack gap={5}>
                  <Text lineHeight={20} fontSize={18} fontWeight="bold" color="$textPrimary">
                    {t('common.prompt')}
                  </Text>
                  <Text fontSize={16} lineHeight={20} numberOfLines={6} ellipsizeMode="tail">
                    {assistant.prompt}
                  </Text>
                </YStack>
              )}
            </YStack>
            {/* Footer positioned absolutely at the bottom */}
            <XStack
              paddingHorizontal={25}
              bottom={bottom}
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
        )}
      </BottomSheetModal>
    )
  }
)

AssistantItemSheet.displayName = 'AssistantItemSheet'

export default AssistantItemSheet
