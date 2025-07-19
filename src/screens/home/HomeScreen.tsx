import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'

import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useNavigation } from '@/hooks/useNavigation'
import { getDefaultAssistant } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { createNewTopic, getNewestTopic } from '@/services/TopicService'
import { runAsyncFunction } from '@/utils'

const logger = loggerService.withContext('HomeScreen')

// todo: 当侧边栏删除当前主页的topic会进入加载状态
const HomeScreen = () => {
  const { navigateToChatScreen } = useNavigation()

  useEffect(() => {
    runAsyncFunction(async () => {
      try {
        const newestTopic = await getNewestTopic()

        if (newestTopic) {
          navigateToChatScreen(newestTopic.id)
        } else {
          const defaultAssistant = await getDefaultAssistant()
          const newTopic = await createNewTopic(defaultAssistant)
          navigateToChatScreen(newTopic.id)
        }
      } catch (error) {
        logger.error('Get Newest Topic', error)
      }
    })
  }, [])

  return (
    <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </SafeAreaContainer>
  )
}

export default HomeScreen
