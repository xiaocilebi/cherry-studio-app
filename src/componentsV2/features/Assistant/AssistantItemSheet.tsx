import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Divider } from 'heroui-native'

import { Text, XStack, YStack } from '@/componentsV2'
import { UnionPlusIcon } from '@/componentsV2/icons'
import { Settings2, X } from '@/componentsV2/icons/LucideIcon'
import { ModelIcon } from '@/components/ui/ModelIcon'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { saveAssistant } from '@/services/AssistantService'
import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { uuid } from '@/utils'
import { formateEmoji } from '@/utils/formats'
import { haptic } from '@/utils/haptic'
import { setCurrentTopicId } from '@/store/topic'
import { useAppDispatch } from '@/store'

import EmojiAvatar from './EmojiAvatar'
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
    const dispatch = useAppDispatch()
    const toast = useToast()
    const [isVisible, setIsVisible] = useState(false)

    const emojiOpacity = Platform.OS === 'android' ? (isDark ? 0.2 : 0.9) : isDark ? 0.2 : 0.5

    useEffect(() => {
      if (!isVisible) return

      const backAction = () => {
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }, [ref, isVisible])

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
      dispatch(setCurrentTopicId(topic.id))
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
        snapPoints={['90%']}
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
          <YStack className="flex-1 gap-10 relative">
            {/* Background blur emoji */}
            <XStack className="w-full h-[200px] rounded-[30px] absolute top-0 left-0 right-0 overflow-hidden flex-wrap">
              {Array.from({ length: 70 }).map((_, index) => (
                <View key={index} className="w-[9.99%] scale-150 items-center justify-center">
                  <Text className="text-[20px]" style={{ opacity: emojiOpacity }}>
                    {formateEmoji(assistant.emoji)}
                  </Text>
                </View>
              ))}
            </XStack>

            {/* BlurView layer */}
            <BlurView
              intensity={Platform.OS === 'android' ? 90 : 90}
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                borderRadius: 30
              }}
            />

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: 4,
                backgroundColor: isDark ? '#333333' : '#dddddd',
                borderRadius: 16
              }}
              onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X className="w-4 h-4" />
            </TouchableOpacity>

            {/* Main Content */}
            <YStack className="flex-1 gap-4 px-6">
              {/* Header with emoji and groups */}
              <YStack className="justify-center items-center gap-5">
                <View className="mt-5">
                  <EmojiAvatar
                    emoji={assistant.emoji}
                    size={120}
                    borderWidth={5}
                    borderColor={isDark ? '#333333' : '#ffffff'}
                  />
                </View>
                <Text className="text-[22px] font-bold text-center text-text-primary dark:text-text-primary-dark">
                  {assistant.name}
                </Text>
                {assistant.group && assistant.group.length > 0 && (
                  <XStack className="gap-2.5 flex-wrap justify-center">
                    {assistant.group.map((group, index) => (
                      <GroupTag
                        key={index}
                        group={group}
                        className="px-2 text-xs bg-green-10 dark:bg-green-dark-10 text-green-100 dark:text-green-dark-100 border-[0.5px] border-green-20 dark:border-green-dark-20"
                      />
                    ))}
                  </XStack>
                )}
                {assistant.defaultModel && (
                  <XStack className="gap-0.5 items-center justify-center">
                    <ModelIcon model={assistant.defaultModel} size={14} />
                    <Text className="text-sm text-text-primary dark:text-text-primary-dark" numberOfLines={1} ellipsizeMode="tail">
                      {assistant.defaultModel.name}
                    </Text>
                  </XStack>
                )}
              </YStack>

              <Divider />

              <BottomSheetScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 16 }}>
                <YStack className="gap-4">
                  {/* Description */}
                  {assistant.description && (
                    <YStack className="gap-1">
                      <Text className="leading-5 text-lg font-bold text-text-primary dark:text-text-primary-dark">
                        {t('common.description')}
                      </Text>
                      <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
                        {assistant.description}
                      </Text>
                    </YStack>
                  )}

                  {/* Additional details could go here */}
                  {assistant.prompt && (
                    <YStack className="gap-1">
                      <Text className="leading-5 text-lg font-bold text-text-primary dark:text-text-primary-dark">
                        {t('common.prompt')}
                      </Text>
                      <Text className="text-base leading-5 text-text-primary dark:text-text-primary-dark">
                        {assistant.prompt}
                      </Text>
                    </YStack>
                  )}
                </YStack>
              </BottomSheetScrollView>
            </YStack>

            {/* Footer positioned absolutely at the bottom */}
            <XStack className="px-6 justify-between items-center gap-4 flex-shrink-0" style={{ bottom }}>
              {source === 'builtIn' && (
                <Button variant='ghost' isIconOnly onPress={handleAddAssistant}>
                  <Button.LabelContent>
                    <UnionPlusIcon size={30} />
                  </Button.LabelContent>
                </Button>
              )}
              {source === 'external' && (
                <Button variant='ghost' isIconOnly onPress={handleEditAssistant}>
                  <Button.LabelContent>
                    <Settings2 size={30}  />
                  </Button.LabelContent>
                </Button>
              )}
              <Button
                className="bg-green-10 dark:bg-green-dark-10 border-green-20 dark:border-green-dark-20 rounded-[30px] py-2.5 px-5 flex-1"
                onPress={actionButton?.onPress || handleChatPress}>
                <Button.LabelContent>
                  <Text className="text-green-100 dark:text-green-dark-100 text-[17px] font-bold">
                    {actionButton?.text || t('assistants.market.button.chat')}
                  </Text>
                </Button.LabelContent>
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
