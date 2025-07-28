import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { ChevronRight, Settings2 } from '@tamagui/lucide-icons'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingHelpText } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import ModelSheet from '@/components/sheets/ModelSheet'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useAssistant } from '@/hooks/useAssistant'
import { Assistant, Model } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'

function ModelPicker({ assistant, onPress }: { assistant: Assistant; onPress: () => void }) {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const model = assistant?.model

  return (
    <Button
      chromeless
      width="100%"
      height="100%"
      paddingHorizontal={16}
      paddingVertical={15}
      onPress={onPress}
      iconAfter={<ChevronRight size={16} />}
      backgroundColor={isDark ? '$uiCardDark' : '$uiCardLight'}>
      <XStack flex={1} alignItems="center" overflow="hidden" justifyContent="space-between">
        {model ? (
          <XStack flex={1} justifyContent="space-between">
            <Text flexShrink={1} numberOfLines={1} ellipsizeMode="tail" fontWeight="bold">
              {t(`provider.${model.provider}`)}
            </Text>
            <Text flexShrink={0} numberOfLines={1} maxWidth="60%" ellipsizeMode="tail" fontSize={12}>
              {model.name}
            </Text>
          </XStack>
        ) : (
          <Text flex={1} numberOfLines={1} ellipsizeMode="tail">
            {t('settings.models.empty')}
          </Text>
        )}
      </XStack>
    </Button>
  )
}

interface AssistantSettingItemProps {
  assistantId: string
  titleKey: string
  descriptionKey: string
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

function AssistantSettingItem({
  assistantId,
  titleKey,
  descriptionKey,
  assistant,
  updateAssistant
}: AssistantSettingItemProps) {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const sheetRef = useRef<BottomSheetModal>(null)

  const handleModelChange = async (models: Model[]) => {
    const newModel = models[0]
    await updateAssistant({ ...assistant, model: newModel })
  }

  return (
    <>
      <YStack gap={8}>
        <XStack justifyContent="space-between" height={20}>
          <Text>{t(titleKey)}</Text>
          <Button
            size={14}
            icon={<Settings2 size={14} color="$textLink" />}
            backgroundColor="$colorTransparent"
            onPress={() => navigation.navigate('AssistantDetailScreen', { assistantId })}
          />
        </XStack>
        <XStack>
          <ModelPicker assistant={assistant} onPress={() => sheetRef.current?.present()} />
        </XStack>
        <SettingHelpText>{t(descriptionKey)}</SettingHelpText>
      </YStack>

      <ModelSheet
        ref={sheetRef}
        mentions={assistant.model ? [assistant.model] : []}
        setMentions={handleModelChange}
        multiple={false}
      />
    </>
  )
}

export default function AssistantSettingsScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  const { assistant: defaultAssistant, updateAssistant: updateDefaultAssistant } = useAssistant('default')
  const { assistant: topicNamingAssistant, updateAssistant: updateTopicNamingAssistant } = useAssistant('topic_naming')
  const { assistant: translateAssistant, updateAssistant: updateTranslateAssistant } = useAssistant('translate')

  const isLoading = !defaultAssistant || !topicNamingAssistant || !translateAssistant

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  const assistantItems = [
    {
      id: 'default',
      titleKey: 'settings.assistant.default_assistant.name',
      descriptionKey: 'settings.assistant.default_assistant.description',
      assistant: defaultAssistant,
      updateAssistant: updateDefaultAssistant
    },
    {
      id: 'topic_naming',
      titleKey: 'settings.assistant.topic_naming_assistant.name',
      descriptionKey: 'settings.assistant.topic_naming_assistant.description',
      assistant: topicNamingAssistant,
      updateAssistant: updateTopicNamingAssistant
    },
    {
      id: 'translate',
      titleKey: 'settings.assistant.translate_assistant.name',
      descriptionKey: 'settings.assistant.translate_assistant.description',
      assistant: translateAssistant,
      updateAssistant: updateTranslateAssistant
    }
  ]

  return (
    <SafeAreaContainer>
      <HeaderBar title={t('settings.assistant.title')} onBackPress={() => navigation.goBack()} />
      <SettingContainer>
        {assistantItems.map(item => (
          <AssistantSettingItem
            key={item.id}
            assistantId={item.id}
            titleKey={item.titleKey}
            descriptionKey={item.descriptionKey}
            assistant={item.assistant}
            updateAssistant={item.updateAssistant}
          />
        ))}
      </SettingContainer>
    </SafeAreaContainer>
  )
}
