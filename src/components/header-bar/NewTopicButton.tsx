import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { Button, XStack } from 'tamagui'

import { useCustomNavigation } from '@/hooks/useNavigation'
import { createNewTopic, getNewestTopic, upsertTopics } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import { EditIcon } from '../icons/EditIcon'

interface NewTopicButtonProps {
  assistant: Assistant
}

export const NewTopicButton: React.FC<NewTopicButtonProps> = ({ assistant }) => {
  const { navigateToChatScreen } = useCustomNavigation()

  const handleAddNewTopic = async () => {
    haptic(ImpactFeedbackStyle.Medium)
    const newestTopic = await getNewestTopic()

    if (newestTopic && newestTopic.messages.length === 0) {
      newestTopic.assistantId = assistant.id
      await upsertTopics([newestTopic])
      navigateToChatScreen(newestTopic.id)
    } else {
      const newTopic = await createNewTopic(assistant)
      navigateToChatScreen(newTopic.id)
    }
  }

  return (
    <XStack alignItems="center" justifyContent="flex-end">
      <Button size={24} circular chromeless icon={<EditIcon size={24} />} onPress={handleAddNewTopic} />
    </XStack>
  )
}
