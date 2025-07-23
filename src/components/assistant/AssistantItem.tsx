import { useNavigation } from '@react-navigation/native'
import { Trash2 } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import { FC, useRef } from 'react'
import React from 'react'
import { RectButton } from 'react-native-gesture-handler'
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Text, XStack, YStack } from 'tamagui'

import { deleteAssistantById } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'
import { getTextPrimaryColor, getTextSecondaryColor } from '@/utils/color'
const logger = loggerService.withContext('Assistant Item')

interface AssistantItemProps {
  assistant: Assistant
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

const AssistantItem: FC<AssistantItemProps> = ({ assistant }) => {
  const isDark = useIsDark()
  const swipeableRef = useRef<SwipeableMethods>(null)
  const navigation = useNavigation<NavigationProps>()

  const renderRightActions = (progress: SharedValue<number>, _: SharedValue<number>) => {
    return <RenderRightActions progress={progress} assistant={assistant} swipeableRef={swipeableRef} />
  }

  const editAssistant = () => {
    navigation.navigate('AssistantDetailScreen', { assistantId: assistant.id })
  }

  return (
    <ReanimatedSwipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={1} rightThreshold={40}>
      <XStack
        borderRadius={16}
        backgroundColor={isDark ? '$uiCardDark' : '$uiCardLight'}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={12}
        paddingHorizontal={20}
        onPress={editAssistant}>
        <XStack gap={14} maxWidth="90%">
          <Text fontSize={35}>{assistant.emoji}</Text>
          <YStack gap={8} flex={1} justifyContent="center">
            <Text
              fontSize={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              fontWeight="bold"
              color={getTextPrimaryColor(isDark)}>
              {assistant.name}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              fontSize={12}
              lineHeight={18}
              color={getTextSecondaryColor(isDark)}>
              {assistant.description}
            </Text>
          </YStack>
        </XStack>
      </XStack>
    </ReanimatedSwipeable>
  )
}

export default AssistantItem
