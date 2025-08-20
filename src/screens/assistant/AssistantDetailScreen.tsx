import { RouteProp, useRoute } from '@react-navigation/native'
import { ArrowLeftRight, PenLine } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { styled, Tabs, Text, XStack, YStack } from 'tamagui'

import { ModelTabContent } from '@/components/assistant/ModelTabContent'
import { PromptTabContent } from '@/components/assistant/PromptTabContent'
import { ToolTabContent } from '@/components/assistant/ToolTabContent'
import { DefaultProviderIcon } from '@/components/icons/DefaultProviderIcon'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { AvatarEditButton } from '@/components/ui/AvatarEditButton'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useAssistant } from '@/hooks/useAssistant'
import { loggerService } from '@/services/LoggerService'
import { RootStackParamList } from '@/types/naviagate'
const logger = loggerService.withContext('AssistantDetailScreen')

type AssistantDetailRouteProp = RouteProp<RootStackParamList, 'AssistantDetailScreen'>

export default function AssistantDetailScreen() {
  const { t } = useTranslation()

  const route = useRoute<AssistantDetailRouteProp>()

  const { assistantId, tab } = route.params
  const [activeTab, setActiveTab] = useState(tab || 'prompt')
  const { assistant, isLoading, updateAssistant } = useAssistant(assistantId)

  const updateAvatar = async (avatar: string) => {
    if (!assistant) return

    try {
      await updateAssistant({ ...assistant, emoji: avatar })
    } catch (error) {
      logger.error('Failed to update avatar', error)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  if (!assistant) {
    return (
      <SafeAreaContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('assistants.error.notFound')}</Text>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <HeaderBar title={!assistant?.emoji ? t('assistants.title.create') : t('assistants.title.edit')} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled">
        <SettingContainer>
          <XStack justifyContent="center" alignItems="center">
            <AvatarEditButton
              content={assistant?.emoji || <DefaultProviderIcon />}
              editIcon={assistant?.emoji ? <ArrowLeftRight size={24} /> : <PenLine size={24} />}
              onEditPress={() => {}}
              updateAvatar={updateAvatar}
            />
          </XStack>
          {/* todo: change active tabs style */}
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="horizontal" flexDirection="column" flex={1}>
            <Tabs.List
              backgroundColor="$colorTransparent"
              borderWidth={1}
              borderColor="$gray20"
              borderRadius={20}
              gap={5}
              paddingVertical={4}
              paddingHorizontal={5}>
              <StyledTab value="prompt">
                <Text fontSize={12} fontWeight="bold">
                  {t('common.prompt')}
                </Text>
              </StyledTab>
              <StyledTab value="model">
                <Text fontSize={12} fontWeight="bold">
                  {t('common.model')}
                </Text>
              </StyledTab>
              <StyledTab value="tool">
                <Text fontSize={12} fontWeight="bold">
                  {t('common.tool')}
                </Text>
              </StyledTab>
            </Tabs.List>
            <YStack flex={1} paddingTop={10}>
              <Tabs.Content value="prompt" flex={1} gap={30}>
                <PromptTabContent assistant={assistant} updateAssistant={updateAssistant} />
              </Tabs.Content>

              <Tabs.Content value="model" flex={1} gap={30}>
                <ModelTabContent assistant={assistant} updateAssistant={updateAssistant} />
              </Tabs.Content>

              <Tabs.Content value="tool" flex={1} gap={30}>
                <ToolTabContent assistant={assistant} updateAssistant={updateAssistant} />
              </Tabs.Content>
            </YStack>
          </Tabs>
        </SettingContainer>
      </KeyboardAwareScrollView>
    </SafeAreaContainer>
  )
}

const StyledTab = styled(Tabs.Tab, {
  flex: 1,
  backgroundColor: '$colorTransparent',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 20
})
