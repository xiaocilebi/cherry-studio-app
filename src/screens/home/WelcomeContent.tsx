import { useNavigation } from '@react-navigation/native'
import { MotiView } from 'moti'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, XStack, YStack } from 'tamagui'

import AssistantItemCard from '@/components/assistant/AssistantItemCard'
import { useBuiltInAssistants } from '@/hooks/useAssistant'
import { NavigationProps } from '@/types/naviagate'

const WelcomeContent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const { assistants: builtInAssistants } = useBuiltInAssistants()

  const handleSeeAllPress = () => {
    navigation.navigate('AssistantMarketScreen')
  }

  return (
    <MotiView
      style={{ flex: 1 }}
      from={{ opacity: 0, translateY: 10 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ opacity: 1, translateY: -10 }}
      transition={{
        type: 'timing'
      }}>
      {/* assistant market(Temporary) */}
      {/*TODO: 主题色需要更改*/}
      <YStack gap={17} paddingHorizontal={20} paddingTop={40}>
        <XStack justifyContent="space-between">
          <Text>{t('assistants.market.popular')}</Text>
          <Text onPress={handleSeeAllPress}>{t('common.see_all')}</Text>
        </XStack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap={20}>
            {builtInAssistants.slice(0, 7).map(assistant => (
              <AssistantItemCard
                key={assistant.id}
                assistant={assistant}
                setIsBottomSheetOpen={() => {}}
                onAssistantPress={() => {}}
              />
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </MotiView>
  )
}

export default WelcomeContent
