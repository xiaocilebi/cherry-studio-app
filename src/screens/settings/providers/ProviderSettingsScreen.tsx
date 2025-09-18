import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { groupBy } from 'lodash'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { View } from 'react-native'

import {
  Container,
  Group,
  GroupTitle,
  HeaderBar,
  ModelGroup,
  PressableRow,
  Row,
  RowRightArrow,
  SafeAreaContainer,
  Text,
  XStack,
  YStack
} from '@/componentsV2'
import { HeartPulse, Plus, Settings2 } from '@/componentsV2/icons/LucideIcon'
import { AddModelSheet } from '@/components/settings/providers/AddModelSheet'
import { IconButton } from '@/components/ui/IconButton'
import { SearchInput } from '@/components/ui/SearchInput'
import { CustomSwitch } from '@/components/ui/Switch'
import { ModelIcon } from '@/components/ui/ModelIcon'
import { ModelTags } from '@/components/ui/ModelTags'
import { useProvider } from '@/hooks/useProviders'
import { useSearch } from '@/hooks/useSearch'
import { ProvidersStackParamList } from '@/navigators/settings/ProvidersStackNavigator'
import { loggerService } from '@/services/LoggerService'
import { Model } from '@/types/assistant'
import { ProvidersNavigationProps } from '@/types/naviagate'

const logger = loggerService.withContext('ProviderSettingsScreen')

type ProviderSettingsRouteProp = RouteProp<ProvidersStackParamList, 'ProviderSettingsScreen'>

export default function ProviderSettingsScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<ProvidersNavigationProps>()
  const route = useRoute<ProviderSettingsRouteProp>()

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present()
  }

  const { providerId } = route.params
  const { provider, isLoading, updateProvider } = useProvider(providerId)

  // Use the search hook for filtering models
  const allModels = provider?.models || []
  const {
    searchText,
    setSearchText,
    filteredItems: searchFilteredModels
  } = useSearch(
    allModels,
    useCallback((model: Model) => [model.name || '', model.id || ''], []),
    { delay: 300 }
  )

  // 使用 groupBy 对过滤后的模型按 group 字段分组
  const modelGroups = groupBy(searchFilteredModels, 'group')

  // Convert to entries and filter empty groups
  const filteredModelGroups = Object.fromEntries(Object.entries(modelGroups).filter(([, models]) => models.length > 0))

  // 对分组进行排序
  const sortedModelGroups = Object.entries(filteredModelGroups).sort(([a], [b]) => a.localeCompare(b))

  const onAddModel = () => {
    handleOpenBottomSheet()
  }

  const onManageModel = () => {
    navigation.navigate('ManageModelsScreen', { providerId })
  }

  const onApiService = () => {
    navigation.navigate('ApiServiceScreen', { providerId })
  }

  // const onSettingModel = (model: Model) => {
  //   logger.info('[ProviderSettingsPage] onSettingModel', model)
  // }

  const handleEnabledChange = async (checked: boolean) => {
    if (provider) {
      const updatedProvider = { ...provider, enabled: checked }

      try {
        await updateProvider(updatedProvider)
      } catch (error) {
        logger.error('Failed to save provider:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <SafeAreaContainer className="flex-1">
        <YStack />
      </SafeAreaContainer>
    )
  }

  if (!provider) {
    return (
      <SafeAreaContainer className="flex-1">
        <HeaderBar title={t('settings.provider.not_found')} />
        <Container className="flex-1">
          <Text className="text-center text-gray-500 py-6">{t('settings.provider.not_found_message')}</Text>
        </Container>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer className="flex-1">
      <HeaderBar
        title={provider.name}
        rightButtons={[
          {
            icon: <Settings2 size={24} />,
            onPress: onManageModel
          },
          {
            icon: <Plus size={24} />,
            onPress: onAddModel
          }
        ]}
      />

      <Container className="pb-0" onStartShouldSetResponder={() => false} onMoveShouldSetResponder={() => false}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}>
          <YStack className="flex-1 gap-6">
            {/* Auth Card */}
            {/* <AuthCard provider={provider} /> */}

            {/* Manage Card */}
            <YStack className="gap-2">
              <GroupTitle>{t('common.manage')}</GroupTitle>
              <Group>
                <Row>
                  <Text>{t('common.enabled')}</Text>
                  <CustomSwitch checked={provider.enabled} onCheckedChange={handleEnabledChange} />
                </Row>
                <PressableRow onPress={onApiService}>
                  <Text>{t('settings.provider.api_service')}</Text>
                  <XStack className="justify-center items-center">
                    {provider.apiKey && provider.apiHost && (
                      <Text className="py-0.5 px-2 rounded-md bg-green-10 border-green-20 text-green-100 dark:text-green-dark-100 border-[0.5px] font-bold text-xs">
                        {t('settings.provider.added')}
                      </Text>
                    )}
                    <RowRightArrow />
                  </XStack>
                </PressableRow>
              </Group>
            </YStack>

            {/* Model List Card with Accordion */}
            <YStack className="flex-1 gap-2">
              <XStack className="justify-between items-center pr-2.5">
                <GroupTitle>{t('settings.models.title')}</GroupTitle>
                <IconButton icon={<HeartPulse size={14} />} />
              </XStack>
              <SearchInput placeholder={t('settings.models.search')} value={searchText} onChangeText={setSearchText} />
              <Group>
                <ModelGroup modelGroups={sortedModelGroups} />
              </Group>
            </YStack>
          </YStack>
        </KeyboardAwareScrollView>
      </Container>

      <AddModelSheet ref={bottomSheetRef} provider={provider} updateProvider={updateProvider} />
    </SafeAreaContainer>
  )
}
