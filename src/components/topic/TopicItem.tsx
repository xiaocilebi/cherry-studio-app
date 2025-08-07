import AsyncStorage from '@react-native-async-storage/async-storage'
import { Trash2 } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import { FC, useEffect, useRef, useState } from 'react'
import React from 'react'
import { RectButton } from 'react-native-gesture-handler'
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { useNavigation } from '@/hooks/useNavigation'
import { getCurrentTopicId } from '@/hooks/useTopic'
import i18n from '@/i18n'
import { getAssistantById, getDefaultAssistant } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { deleteMessagesByTopicId } from '@/services/MessagesService'
import { createNewTopic, deleteTopicById, getNewestTopic } from '@/services/TopicService'
import { Assistant, Topic } from '@/types/assistant'
import { useIsDark } from '@/utils'
import { getTextPrimaryColor, getTextSecondaryColor, getUiCardColor } from '@/utils/color'
const logger = loggerService.withContext('Topic Item')

type TimeFormat = 'time' | 'date'

interface TopicItemProps {
  topic: Topic
  timeFormat?: TimeFormat
}

interface RenderRightActionsProps {
  progress: SharedValue<number>
  topic: Topic
  swipeableRef: React.RefObject<SwipeableMethods | null>
}

const RenderRightActions: FC<RenderRightActionsProps> = ({ progress, topic, swipeableRef }) => {
  const theme = useTheme()
  const { navigateToChatScreen } = useNavigation()
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [50, 0])

    return {
      transform: [{ translateX }]
    }
  })

  const handleDelete = async () => {
    try {
      swipeableRef.current?.close()
      const deletedTopicId = topic.id
      await deleteMessagesByTopicId(deletedTopicId)
      await deleteTopicById(deletedTopicId)

      if (deletedTopicId === getCurrentTopicId()) {
        const nextTopic = await getNewestTopic()

        if (nextTopic) {
          // 如果还有其他 topic，直接跳转到最新的那一个
          navigateToChatScreen(nextTopic.id)
          logger.info('navigateToChatScreen after delete', nextTopic)
        } else {
          const defaultAssistant = await getDefaultAssistant()
          const newTopic = await createNewTopic(defaultAssistant)
          navigateToChatScreen(newTopic.id)
          logger.info('navigateToChatScreen with new topic', newTopic)
        }
      }
    } catch (error) {
      logger.error('Delete Topic error', error)
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
        <Trash2 color={theme.textDelete} size={20} />
      </RectButton>
    </MotiView>
  )
}

const TopicItem: FC<TopicItemProps> = ({ topic, timeFormat = 'time' }) => {
  const theme = useTheme()
  const isDark = useIsDark()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)
  const swipeableRef = useRef<SwipeableMethods>(null)
  const { navigateToChatScreen } = useNavigation()
  const [assistant, setAssistant] = useState<Assistant>()

  const renderRightActions = (progress: SharedValue<number>, _: SharedValue<number>) => {
    return <RenderRightActions progress={progress} topic={topic} swipeableRef={swipeableRef} />
  }

  const openTopic = () => {
    navigateToChatScreen(topic.id)
  }

  const date = new Date(topic.updatedAt)
  const displayTime =
    timeFormat === 'date'
      ? date.toLocaleDateString(currentLanguage, {
          month: 'short',
          day: 'numeric'
        })
      : date.toLocaleTimeString(currentLanguage, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })

  useEffect(() => {
    const fetchCurrentLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language')

      if (storedLanguage) {
        setCurrentLanguage(storedLanguage)
      }
    }

    const fetchAssistant = async () => {
      setAssistant(await getAssistantById(topic.assistantId))
    }

    fetchCurrentLanguage()
    fetchAssistant()
  }, [])

  return (
    <ReanimatedSwipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={1} rightThreshold={40}>
      <XStack
        backgroundColor={getUiCardColor(isDark)}
        borderRadius={30}
        paddingVertical={5}
        paddingHorizontal={20}
        gap={14}
        justifyContent="center"
        alignItems="center">
        <Text fontSize={24}>{assistant?.emoji}</Text>
        <YStack flex={1}>
          <XStack justifyContent="space-between">
            <Text fontWeight="bold" color={getTextPrimaryColor(isDark)}>
              {assistant?.name}
            </Text>
            <Text fontSize={12} color={getTextSecondaryColor(isDark)}>
              {displayTime}
            </Text>
          </XStack>
          <Text
            fontSize={12}
            numberOfLines={1}
            ellipsizeMode="tail"
            fontWeight="400"
            color={getTextPrimaryColor(isDark)}>
            {topic.name}
          </Text>
        </YStack>
      </XStack>
    </ReanimatedSwipeable>
  )
}

export default TopicItem
