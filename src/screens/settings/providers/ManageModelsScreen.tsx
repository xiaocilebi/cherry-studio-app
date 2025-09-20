import { RouteProp, useRoute } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { groupBy, isEmpty, uniqBy } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView } from 'react-native'
import { Tabs } from 'tamagui'

import {
  Container,
  Group,
  HeaderBar,
  ModelGroup,
  SafeAreaContainer,
  Text,
  XStack,
  YStack,
  IconButton
, SearchInput } from '@/componentsV2'
import { Minus, Plus } from '@/componentsV2/icons/LucideIcon'
import {
  groupQwenModels,
  isEmbeddingModel,
  isFunctionCallingModel,
  isReasoningModel,
  isRerankModel,
  isVisionModel,
  isWebSearchModel
} from '@/config/models'
import { isFreeModel } from '@/config/models/free'
import { useSearch } from '@/hooks/useSearch'
import { ProvidersStackParamList } from '@/navigators/settings/ProvidersStackNavigator'
import { fetchModels } from '@/services/ApiService'
import { loggerService } from '@/services/LoggerService'
import { getProviderById, saveProvider } from '@/services/ProviderService'
import { Model, Provider } from '@/types/assistant'
import { haptic } from '@/utils/haptic'
import { getDefaultGroupName } from '@/utils/naming'
import { ModelIcon } from '@/componentsV2/icons'
import { ModelTags } from '@/componentsV2/features/ModelTags'
const logger = loggerService.withContext('ManageModelsScreen')

type ProviderSettingsRouteProp = RouteProp<ProvidersStackParamList, 'ManageModelsScreen'>

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
  const route = useRoute<ProviderSettingsRouteProp>()

  const [allModels, setAllModels] = useState<Model[]>([])
  const [activeFilterType, setActiveFilterType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const { providerId } = route.params
  const [provider, setProvider] = useState<Provider | undefined>(undefined)
  // const { provider, updateProvider } = useProvider(providerId)

  const isModelInCurrentProvider = getIsModelInProvider(provider?.models || [])
  const isAllModelsInCurrentProvider = getIsAllInProvider(isModelInCurrentProvider)

  const {
    searchText,
    setSearchText,
    filteredItems: searchFilteredModels
  } = useSearch(
    allModels,
    useCallback((model: Model) => [model.id, model.name || ''], []),
    { delay: 300 }
  )

  const filteredModels = filterModels(searchFilteredModels, '', activeFilterType)
  const sortedModelGroups = groupAndSortModels(filteredModels, provider?.id || '')

  const handleUpdateModels = async (newModels: Model[]) => {
    if (!provider) return
    const updatedProvider = { ...provider, models: newModels }
    setProvider(updatedProvider)
    await saveProvider(updatedProvider)
  }

  const onAddModel = async (model: Model) => {
    haptic(ImpactFeedbackStyle.Medium)
    await handleUpdateModels(uniqBy([...(provider?.models || []), model], 'id'))
  }

  const onRemoveModel = async (model: Model) => {
    haptic(ImpactFeedbackStyle.Medium)
    await handleUpdateModels((provider?.models || []).filter(m => m.id !== model.id))
  }

  const onAddAllModels = async (modelsToAdd: Model[]) => {
    haptic(ImpactFeedbackStyle.Medium)
    await handleUpdateModels(uniqBy([...(provider?.models || []), ...modelsToAdd], 'id'))
  }

  const onRemoveAllModels = async (modelsToRemove: Model[]) => {
    haptic(ImpactFeedbackStyle.Medium)
    const modelsToRemoveIds = new Set(modelsToRemove.map(m => m.id))
    await handleUpdateModels((provider?.models || []).filter(m => !modelsToRemoveIds.has(m.id)))
  }

  useEffect(() => {
    const fetchAndSetModels = async () => {
      const fetchedProvider = await getProviderById(providerId)
      setProvider(fetchedProvider)

      if (!fetchedProvider) return
      setIsLoading(true)

      try {
        const modelsFromApi = await fetchModels(fetchedProvider)
        const transformedModels = transformApiModels(modelsFromApi, fetchedProvider)
        setAllModels(uniqBy(transformedModels, 'id'))
      } catch (error) {
        logger.error('Failed to fetch models', error)
        setAllModels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndSetModels()
  }, [providerId])

  const getTabStyle = (isActive: boolean) => ({
    height: '100%',
    backgroundColor: isActive ? '$background' : 'transparent',
    borderRadius: 20
  })

  return (
    <SafeAreaContainer className="flex-1">
     {provider && <HeaderBar title={t(`provider.${provider.id}`, { defaultValue: provider.name })} /> }
      {isLoading ? (
        <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </SafeAreaContainer>
      ) : (
        <Container className="pb-0" onStartShouldSetResponder={() => false} onMoveShouldSetResponder={() => false}>
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

          <SearchInput placeholder={t('settings.models.search')} value={searchText} onChangeText={setSearchText} />

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <Group className="flex-1">
              <ModelGroup
                modelGroups={sortedModelGroups}
                renderModelItem={(model, index) => (
                  <XStack className="items-center justify-between w-full">
                    <XStack className="flex-1 gap-2">
                      <XStack className="items-center justify-center">
                        <ModelIcon model={model} />
                      </XStack>
                      <YStack className="flex-1 gap-1">
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          {model.name}
                        </Text>
                        <ModelTags model={model} size={11} />
                      </YStack>
                    </XStack>
                    <XStack>
                      <IconButton
                        icon={
                          isModelInCurrentProvider(model.id) ? (
                            <Minus size={18} className="rounded-full bg-red-20 text-red-100 dark:text-red-100" />
                          ) : (
                            <Plus
                              size={18}
                              className="rounded-full bg-green-20 text-green-100 dark:bg-green-dark-20 dark:text-green-dark-100"
                            />
                          )
                        }
                        onPress={
                          isModelInCurrentProvider(model.id) ? () => onRemoveModel(model) : () => onAddModel(model)
                        }
                      />
                    </XStack>
                  </XStack>
                )}
                renderGroupButton={(groupName, models) => (
                  <IconButton
                    icon={
                      isAllModelsInCurrentProvider(models) ? (
                        <Minus size={18} className="rounded-full bg-red-20 text-red-100 dark:text-red-100" />
                      ) : (
                        <Plus
                          size={18}
                          className="rounded-full bg-green-20 text-green-100 dark:bg-green-dark-20 dark:text-green-dark-100"
                        />
                      )
                    }
                    onPress={
                      isAllModelsInCurrentProvider(models)
                        ? () => onRemoveAllModels(models)
                        : () => onAddAllModels(models)
                    }
                  />
                )}
              />
            </Group>
          </ScrollView>
        </Container>
      )}
    </SafeAreaContainer>
  )
}
