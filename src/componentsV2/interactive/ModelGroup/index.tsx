import React from 'react'
import { useTranslation } from 'react-i18next'
import Animated from 'react-native-reanimated'

import { Accordion, AccordionLayoutTransition } from 'heroui-native'

import Text from '../../base/Text'
import XStack from '../../layout/XStack'
import YStack from '../../layout/YStack'
import { ModelIcon } from '@/components/ui/ModelIcon'
import { ModelTags } from '@/components/ui/ModelTags'
import { Model } from '@/types/assistant'

export interface ModelGroupProps {
  /** Model groups data in format [[groupName, models[]], ...] */
  modelGroups: [string, Model[]][]
  /** Whether to show empty state */
  showEmptyState?: boolean
  /** Translation key for empty state text */
  emptyStateKey?: string
  /** Custom function to render each model item */
  renderModelItem?: (model: Model, index: number) => React.ReactNode
  /** Function to render group header button */
  renderGroupButton?: (groupName: string, models: Model[]) => React.ReactNode
}

const DefaultModelItem: React.FC<{ model: Model; index: number }> = ({ model }) => (
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
  </XStack>
)

export default function ModelGroup({
  modelGroups,
  showEmptyState = true,
  emptyStateKey = 'models.no_models',
  renderModelItem = (model, index) => <DefaultModelItem model={model} index={index} />,
  renderGroupButton
}: ModelGroupProps) {
  const { t } = useTranslation()

  if (showEmptyState && modelGroups.length === 0) {
    return (
      <YStack className="flex-1 justify-center items-center">
        <Text className="text-center text-gray-500">{t(emptyStateKey)}</Text>
      </YStack>
    )
  }

  return (
    <Animated.View className="flex-1" layout={AccordionLayoutTransition}>
      <Accordion className="flex-1" selectionMode="multiple" variant="border">
        {modelGroups.map(([groupName, models], index) => (
          <Accordion.Item key={index} value={groupName}>
            <Accordion.Trigger className="bg-ui-card-background dark:bg-ui-card-background-dark">
              <XStack className="flex-1 gap-3 items-center justify-between">
                <XStack className="flex-1 gap-3 items-center">
                  <Accordion.Indicator />
                  <Text className="font-bold">{groupName}</Text>
                  <XStack className="w-4 h-4 justify-center items-center p-3 rounded-md bg-green-20 dark:bg-green-dark-20">
                    <Text className="text-[10px] h-3 w-3 text-center text-green-100 dark:text-green-dark-100">
                      {models.length}
                    </Text>
                  </XStack>
                </XStack>
                {renderGroupButton && renderGroupButton(groupName, models)}
              </XStack>
            </Accordion.Trigger>
            <Accordion.Content className="bg-ui-card-background dark:bg-ui-card-background-dark">
              {models.map((model, modelIndex) => (
                <React.Fragment key={model.id || modelIndex}>{renderModelItem(model, modelIndex)}</React.Fragment>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Animated.View>
  )
}

ModelGroup.displayName = 'ModelGroup'
