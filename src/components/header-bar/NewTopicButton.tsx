import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { Button, XStack } from 'tamagui'

import { useNavigation } from '@/hooks/useNavigation'
import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import { EditIcon } from '../icons/EditIcon'

interface NewTopicButtonProps {
  assistant: Assistant
}

export const NewTopicButton: React.FC<NewTopicButtonProps> = ({ assistant }) => {
  const { navigateToChatScreen } = useNavigation()

  const handleAddNewTopic = async () => {
    haptic(ImpactFeedbackStyle.Medium)
    const newTopic = await createNewTopic(assistant)
    navigateToChatScreen(newTopic.id)
  }

  return (
    <XStack alignItems="center" justifyContent="flex-end">
      <Button size={24} circular chromeless icon={<EditIcon size={24} />} onPress={handleAddNewTopic} />
    </XStack>
  )
}
