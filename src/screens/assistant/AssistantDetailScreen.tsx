import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ArrowLeftRight, PenLine } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { Text, XStack } from 'tamagui'

import { DefaultProviderIcon } from '@/components/icons/DefaultProviderIcon'
import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { AvatarEditButton } from '@/components/ui/AvatarEditButton'
import { DrawerGestureWrapper } from '@/components/ui/DrawerGestureWrapper'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useAssistant } from '@/hooks/useAssistant'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import AssistantDetailTabNavigator from '@/navigators/AssistantDetailTabNavigator'
import { AssistantStackParamList } from '@/navigators/AssistantStackNavigator'
import { loggerService } from '@/services/LoggerService'
import { DrawerNavigationProps } from '@/types/naviagate'
const logger = loggerService.withContext('AssistantDetailScreen')

type AssistantDetailRouteProp = RouteProp<AssistantStackParamList, 'AssistantDetailScreen'>

export default function AssistantDetailScreen() {
  const { t } = useTranslation()

  const route = useRoute<AssistantDetailRouteProp>()
  const navigation = useNavigation<DrawerNavigationProps>()
  const { assistantId } = route.params
  const { assistant, isLoading, updateAssistant } = useAssistant(assistantId)
  const panGesture = useSwipeGesture()

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
        <DrawerGestureWrapper>
          <View collapsable={false} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </DrawerGestureWrapper>
      </SafeAreaContainer>
    )
  }

  if (!assistant) {
    return (
      <SafeAreaContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <DrawerGestureWrapper>
          <View collapsable={false} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{t('assistants.error.notFound')}</Text>
          </View>
        </DrawerGestureWrapper>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer>
      <GestureDetector gesture={panGesture}>
        <View collapsable={false} style={{ flex: 1 }}>
          <HeaderBar
            title={!assistant?.emoji ? t('assistants.title.create') : t('assistants.title.edit')}
            onBackPress={() => navigation.goBack()}
          />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            bottomOffset={10}>
            <SettingContainer>
              <XStack justifyContent="center" alignItems="center" paddingBottom={20}>
                <AvatarEditButton
                  content={assistant?.emoji || <DefaultProviderIcon />}
                  editIcon={assistant?.emoji ? <ArrowLeftRight size={24} /> : <PenLine size={24} />}
                  onEditPress={() => {}}
                  updateAvatar={updateAvatar}
                />
              </XStack>

              {/* Material Top Tabs Navigator */}
              <View style={{ flex: 1 }}>
                <AssistantDetailTabNavigator assistant={assistant} updateAssistant={updateAssistant} />
              </View>
            </SettingContainer>
          </KeyboardAwareScrollView>
        </View>
      </GestureDetector>
    </SafeAreaContainer>
  )
}
