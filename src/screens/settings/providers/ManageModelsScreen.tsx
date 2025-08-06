import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Minus, Plus } from '@tamagui/lucide-icons'
import { debounce, groupBy, isEmpty, uniqBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Accordion, Button, ScrollView, Tabs, Text, useTheme, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { ModelGroup } from '@/components/settings/providers/ModelGroup'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { SearchInput } from '@/components/ui/SearchInput'
import { groupQwenModels, isFreeModel } from '@/config/models'
import { isEmbeddingModel } from '@/config/models/embedding'
import { isFunctionCallingModel } from '@/config/models/functionCalling'
import { isReasoningModel } from '@/config/models/reasoning'
import { isRerankModel } from '@/config/models/rerank'
import { isVisionModel } from '@/config/models/vision'
import { isWebSearchModel } from '@/config/models/webSearch'
import { useProvider } from '@/hooks/useProviders'
import { fetchModels } from '@/services/ApiService'
import { loggerService } from '@/services/LoggerService'
import { Model, Provider } from '@/types/assistant'
import { RootStackParamList } from '@/types/naviagate'
import { useIsDark } from '@/utils'
import { getGreenColor } from '@/utils/color'
import { getDefaultGroupName } from '@/utils/naming'
const logger = loggerService.withContext('ManageModelsScreen')

type ProviderSettingsRouteProp = RouteProp<RootStackParamList, 'ManageModelsScreen'>

const getIsModelInProvider = (providerModels: Model[]) => {
  const providerModelIds = new Set(providerModels.map(m => m.id))
  return (modelId: string): boolean => providerModelIds.has(modelId)
}

const getIsAllInProvider = (isModelInProviderFunc: (modelId: string) => boolean) => {
  return (models: Model[]): boolean => models.every(model => isModelInProviderFunc(model.id))
}

const modelFilterFunctions = {
  reasoning: isReasoningModel,
  vision: isVisionModel,
  websearch: isWebSearchModel,
  free: isFreeModel,
  embedding: isEmbeddingModel,
  function_calling: isFunctionCallingModel,
  rerank: isRerankModel
}

const filterModels = (models: Model[], searchText: string, filterType: string): Model[] => {
  const lowercasedSearchText = searchText.toLowerCase()
  const filterFn = modelFilterFunctions[filterType] || (() => true)

  return models.filter(model => {
    const matchesSearch =
      !lowercasedSearchText ||
      model.id.toLowerCase().includes(lowercasedSearchText) ||
      model.name?.toLowerCase().includes(lowercasedSearchText)

    return matchesSearch && filterFn(model)
  })
}

const groupAndSortModels = (models: Model[], providerId: string) => {
  const modelGroups =
    providerId === 'dashscope'
      ? {
          ...groupBy(
            models.filter(model => !model.id.startsWith('qwen')),
            'group'
          ),
          ...groupQwenModels(models.filter(model => model.id.startsWith('qwen')))
        }
      : groupBy(models, 'group')

  return Object.entries(modelGroups).sort(([a], [b]) => a.localeCompare(b))
}

const transformApiModels = (apiModels: any[], provider: Provider): Model[] => {
  return apiModels
    .map(model => ({
      id: model?.id || model?.name,
      name: model?.display_name || model?.displayName || model?.name || model?.id,
      provider: provider.id,
      group: getDefaultGroupName(model?.id || model?.name, provider.id),
      description: model?.description || '',
      owned_by: model?.owned_by || ''
    }))
    .filter(model => !isEmpty(model.name))
}

// --- Tab Configuration (Static) ---

const TAB_CONFIGS = [
  { value: 'all', i18nKey: 'models.type.all' },
  { value: 'reasoning', i18nKey: 'models.type.reasoning' },
  { value: 'vision', i18nKey: 'models.type.vision' },
  { value: 'websearch', i18nKey: 'models.type.websearch' },
  { value: 'free', i18nKey: 'models.type.free' },
  { value: 'embedding', i18nKey: 'models.type.embedding' },
  { value: 'rerank', i18nKey: 'models.type.rerank' },
  { value: 'function_calling', i18nKey: 'models.type.function_calling' }
]

export default function ManageModelsScreen() {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute<ProviderSettingsRouteProp>()

  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [allModels, setAllModels] = useState<Model[]>([])
  const [activeFilterType, setActiveFilterType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // 创建防抖函数，300ms 延迟
  const debouncedSetSearch = debounce((text: string) => {
    setDebouncedSearchText(text)
  }, 300)

  const { providerId } = route.params
  const { provider, updateProvider } = useProvider(providerId)

  const isModelInCurrentProvider = getIsModelInProvider(provider?.models || [])
  const isAllModelsInCurrentProvider = getIsAllInProvider(isModelInCurrentProvider)

  const filteredModels = filterModels(allModels, debouncedSearchText, activeFilterType)
  const sortedModelGroups = groupAndSortModels(filteredModels, provider?.id || '')

  // 监听 searchText 变化，触发防抖更新
  useEffect(() => {
    debouncedSetSearch(searchText)

    // 清理函数，组件卸载时取消防抖
    return () => {
      debouncedSetSearch.cancel()
    }
  })

  const handleUpdateModels = async (newModels: Model[]) => {
    if (!provider) return
    const updatedProvider = { ...provider, models: newModels }
    await updateProvider(updatedProvider)
  }

  const onAddModel = async (model: Model) => {
    await handleUpdateModels(uniqBy([...(provider?.models || []), model], 'id'))
  }

  const onRemoveModel = async (model: Model) => {
    await handleUpdateModels((provider?.models || []).filter(m => m.id !== model.id))
  }

  const onAddAllModels = async (modelsToAdd: Model[]) => {
    await handleUpdateModels(uniqBy([...(provider?.models || []), ...modelsToAdd], 'id'))
  }

  const onRemoveAllModels = async (modelsToRemove: Model[]) => {
    const modelsToRemoveIds = new Set(modelsToRemove.map(m => m.id))
    await handleUpdateModels((provider?.models || []).filter(m => !modelsToRemoveIds.has(m.id)))
  }

  useEffect(() => {
    const fetchAndSetModels = async () => {
      if (!provider) return
      setIsLoading(true)

      try {
        const modelsFromApi = await fetchModels(provider)
        const transformedModels = transformApiModels(modelsFromApi, provider)
        setAllModels(uniqBy(transformedModels, 'id'))
      } catch (error) {
        logger.error('Failed to fetch models', error)
        setAllModels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndSetModels()
  }, [provider, provider?.id])

  const renderModelGroupItem = ({ item: [groupName, currentModels], index }: ListRenderItemInfo<[string, Model[]]>) => (
    <ModelGroup
      groupName={groupName}
      models={currentModels}
      index={index}
      showModelCount={true}
      renderGroupButton={groupButtonModels => (
        <Button
          size={20}
          chromeless
          icon={
            isAllModelsInCurrentProvider(groupButtonModels) ? (
              <Minus size={14} borderRadius={99} backgroundColor="$red20" color="$red100" />
            ) : (
              <Plus
                size={14}
                borderRadius={99}
                backgroundColor={getGreenColor(isDark, 20)}
                color={getGreenColor(isDark, 100)}
              />
            )
          }
          onPress={
            isAllModelsInCurrentProvider(groupButtonModels)
              ? () => onRemoveAllModels(groupButtonModels)
              : () => onAddAllModels(groupButtonModels)
          }
        />
      )}
      renderModelButton={model => (
        <Button
          size={14}
          chromeless
          icon={
            isModelInCurrentProvider(model.id) ? (
              <Minus size={14} borderRadius={99} backgroundColor="$red20" color="$red100" />
            ) : (
              <Plus
                size={14}
                borderRadius={99}
                backgroundColor={getGreenColor(isDark, 20)}
                color={getGreenColor(isDark, 100)}
              />
            )
          }
          onPress={isModelInCurrentProvider(model.id) ? () => onRemoveModel(model) : () => onAddModel(model)}
        />
      )}
    />
  )

  const getTabStyle = (isActive: boolean) => ({
    height: '100%',
    backgroundColor: isActive ? '$background' : 'transparent',
    borderRadius: 15
  })

  return (
    <SafeAreaContainer
      style={{
        flex: 1,
        backgroundColor: theme.background.val
      }}>
      <HeaderBar title={provider?.name || t('settings.models.manage_models')} onBackPress={() => navigation.goBack()} />
      <SettingContainer>
        {/* Filter Tabs */}
        <Tabs
          defaultValue="all"
          value={activeFilterType}
          onValueChange={setActiveFilterType}
          orientation="horizontal"
          flexDirection="column"
          height={34}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Tabs.List aria-label="Model filter tabs" gap="10" flexDirection="row">
              {TAB_CONFIGS.map(({ value, i18nKey }) => (
                <Tabs.Tab key={value} value={value} {...getTabStyle(activeFilterType === value)}>
                  <Text>{t(i18nKey)}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </ScrollView>
        </Tabs>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <YStack flex={1} gap={24}>
            {/* Search Card */}
            <SearchInput placeholder={t('settings.models.search')} value={searchText} onChangeText={setSearchText} />

            {/* Model List Card with Accordion */}
            {isLoading ? (
              <SafeAreaContainer>
                <ActivityIndicator />
              </SafeAreaContainer>
            ) : (
              <YStack flex={1}>
                {sortedModelGroups.length > 0 ? (
                  <Accordion overflow="hidden" type="multiple">
                    <FlashList
                      showsVerticalScrollIndicator={false}
                      data={sortedModelGroups}
                      renderItem={renderModelGroupItem}
                      keyExtractor={([groupName]) => groupName}
                      estimatedItemSize={60}
                      extraData={provider}
                    />
                  </Accordion>
                ) : (
                  <Text textAlign="center" color="$gray10" paddingVertical={24}>
                    {t('models.no_models')}
                  </Text>
                )}
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
