import { ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { Accordion, Square, Text, XStack, YStack } from 'tamagui'

import { ModelIcon } from '@/components/ui/ModelIcon'
import { ModelTags } from '@/components/ui/ModelTags'
import { Model } from '@/types/assistant'
import { useIsDark } from '@/utils'

interface ModelGroupProps {
  groupName: string
  models: Model[]
  index: number
  renderGroupButton?: (models: Model[]) => React.ReactNode
  renderModelButton?: (model: Model) => React.ReactNode
  showModelCount?: boolean
}

export function ModelGroup({
  groupName,
  models,
  index,
  renderGroupButton,
  renderModelButton,
  showModelCount = false
}: ModelGroupProps) {
  const isDark = useIsDark()
  return (
    <Accordion.Item key={groupName} value={`item-${index}`} marginBottom={8}>
      <Accordion.Trigger
        backgroundColor="$uiCardBackground"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={12}
        paddingHorizontal={16}
        borderRadius={9}
        borderWidth={0}>
        {({ open }: { open: boolean }) => (
          <XStack gap={10} alignItems="center" justifyContent="space-between">
            <XStack gap={10} alignItems="center" flex={1}>
              <Square animation="quick" rotate={open ? '0deg' : '-90deg'}>
                <ChevronDown size={14} />
              </Square>
              <Text fontSize={14} fontWeight="bold">
                {groupName}
              </Text>
              {showModelCount && (
                <Text paddingHorizontal={8} borderRadius={8} backgroundColor="$green20" color="$green100">
                  {models.length}
                </Text>
              )}
            </XStack>

            {renderGroupButton?.(models)}
          </XStack>
        )}
      </Accordion.Trigger>

      <Accordion.HeightAnimator animation="quick">
        <Accordion.Content
          exitStyle={{ opacity: 0 }}
          borderBottomLeftRadius={9}
          borderBottomRightRadius={9}
          backgroundColor="$uiCardBackground">
          <YStack flex={1} width="100%" gap={8}>
            {models.map(model => (
              <XStack
                key={model.id}
                alignItems="center"
                justifyContent="space-between"
                paddingHorizontal={8}
                width="100%">
                <XStack gap={8} flex={1} maxWidth="80%">
                  {/* icon */}
                  <XStack justifyContent="center" alignItems="center" flexShrink={0}>
                    <ModelIcon model={model} />
                  </XStack>
                  {/* name and tool */}
                  <YStack gap={5} flex={1} minWidth={0}>
                    <Text numberOfLines={1} ellipsizeMode="tail">
                      {model.name}
                    </Text>
                    <ModelTags model={model} size={11} />
                  </YStack>
                </XStack>
                <XStack flexShrink={0} marginLeft={8}>
                  {renderModelButton?.(model)}
                </XStack>
              </XStack>
            ))}
          </YStack>
        </Accordion.Content>
      </Accordion.HeightAnimator>
    </Accordion.Item>
  )
}
