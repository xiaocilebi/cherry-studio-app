import { useNavigation } from '@react-navigation/native'
import { SquarePen } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, XStack } from 'tamagui'

import { createNewTopic } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'

interface NewTopicButtonProps {
  assistant: Assistant
}

export const NewTopicButton: React.FC<NewTopicButtonProps> = ({ assistant }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  const handleAddNewTopic = async () => {
    haptic(ImpactFeedbackStyle.Medium)
    const newTopic = await createNewTopic(assistant)
    navigation.navigate('ChatScreen', { topicId: newTopic.id })
  }

  return (
    <XStack alignItems="center" justifyContent="flex-end">
      <Button size={24} circular chromeless icon={<SquarePen size={24} />} onPress={handleAddNewTopic} />
    </XStack>
  )
}
