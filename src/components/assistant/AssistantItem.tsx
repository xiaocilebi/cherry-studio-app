import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Trash2 } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import { RectButton } from 'react-native-gesture-handler'
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Stack, Text, XStack, YStack } from 'tamagui'

import i18n from '@/i18n'
import { deleteAssistantById } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'
import { getTextPrimaryColor, getTextSecondaryColor } from '@/utils/color'
const logger = loggerService.withContext('Assistant Item')

type TimeFormat = 'time' | 'date'

interface AssistantItemProps {
  assistant: Assistant
  timeFormat?: TimeFormat // Added timeFormat parameter
}

interface RenderRightActionsProps {
  progress: SharedValue<number>
  assistant: Assistant
  swipeableRef: React.RefObject<SwipeableMethods | null>
}

const RenderRightActions: FC<RenderRightActionsProps> = ({ progress, assistant, swipeableRef }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [50, 0])

    return {
      transform: [{ translateX }]
    }
  })

  const handleDelete = async () => {
    try {
      swipeableRef.current?.close()
      await deleteAssistantById(assistant.id)
    } catch (error) {
      logger.error('Delete Assistant error', error)
    }
  }

  return (
    <MotiView style={[{ width: 80 }, animatedStyle]}>
      <RectButton
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={handleDelete}>
        <Trash2 color="$textDelete" size={20} />
      </RectButton>
    </MotiView>
  )
}

const AssistantItem: FC<AssistantItemProps> = ({ assistant, timeFormat = 'time' }) => {
  const isDark = useIsDark()
  const swipeableRef = useRef<SwipeableMethods>(null)
  const navigation = useNavigation<NavigationProps>()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)

  useEffect(() => {
    const fetchCurrentLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language')

      if (storedLanguage) {
        setCurrentLanguage(storedLanguage)
      }
    }

    fetchCurrentLanguage()
  }, [])

  const renderRightActions = (progress: SharedValue<number>, _: SharedValue<number>) => {
    return <RenderRightActions progress={progress} assistant={assistant} swipeableRef={swipeableRef} />
  }

  const editAssistant = () => {
    navigation.navigate('AssistantDetailScreen', { assistantId: assistant.id })
  }

  const displayTime = useMemo(() => {
    const latestTimestamp =
      assistant.topics?.reduce((latest, topic) => {
        const topicUpdateTime = new Date(topic.updatedAt).getTime()
        return topicUpdateTime > latest ? topicUpdateTime : latest
      }, 0) ?? 0

    if (latestTimestamp === 0) {
      return '' // Return empty if no topic activity
    }

    const date = new Date(latestTimestamp)

    if (timeFormat === 'date') {
      return date.toLocaleDateString(currentLanguage, {
        month: 'short',
        day: 'numeric'
      })
    }

    // Default to 'time' format
    return date.toLocaleTimeString(currentLanguage, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }, [assistant.topics, timeFormat, currentLanguage])

  return (
    <ReanimatedSwipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={1} rightThreshold={40}>
      <XStack
        borderRadius={30}
        backgroundColor={isDark ? '$uiCardDark' : '$uiCardLight'}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={3}
        paddingHorizontal={20}
        onPress={editAssistant}>
        <XStack gap={14} maxWidth="70%">
          <Text fontSize={35}>{assistant.emoji}</Text>
          <YStack gap={2} flex={1} justifyContent="center">
            <Text
              fontSize={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              fontWeight="600"
              color={getTextPrimaryColor(isDark)}>
              {assistant.name}
            </Text>
            {displayTime && (
              <Text fontSize={12} lineHeight={18} color={getTextSecondaryColor(isDark)}>
                {displayTime}
              </Text>
            )}
          </YStack>
        </XStack>
        <Stack
          borderRadius={24}
          borderWidth={0.5}
          padding={3}
          gap={2}
          justifyContent="center"
          alignItems="center"
          borderColor={isDark ? '$green20Dark' : '$green20Light'}
          backgroundColor={isDark ? '$green10Dark' : '$green10Light'}
          minWidth={20}
          minHeight={20}>
          <Text fontSize={10} textAlign="center" color={isDark ? '$green100Light' : '$green100Dark'}>
            {assistant.topics?.length ?? 0}
          </Text>
        </Stack>
      </XStack>
    </ReanimatedSwipeable>
  )
}

export default AssistantItem
