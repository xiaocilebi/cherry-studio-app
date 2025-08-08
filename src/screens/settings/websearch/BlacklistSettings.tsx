import { ChevronDown, Plus, RefreshCcw } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Accordion, Button, Square, Text, TextArea, XStack, YStack } from 'tamagui'

import { SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { SubscribeSource } from '@/types/websearch'
import { useIsDark } from '@/utils'

interface BlacklistSettingsProps {
  blacklistText: string
  onBlacklistTextChange: (text: string) => void
  subscriptions: SubscribeSource[]
  onRefreshSubscription: (subscription: SubscribeSource) => void
  onRefreshAllSubscriptions: () => void
  onAddSubscription: () => void
}

export default function BlacklistSettings({
  blacklistText,
  onBlacklistTextChange,
  subscriptions,
  onRefreshSubscription,
  onRefreshAllSubscriptions,
  onAddSubscription
}: BlacklistSettingsProps) {
  const { t } = useTranslation()
  const isDark = useIsDark()

  const renderAccordionTriggerContent = ({ open }: { open: boolean }) => (
    <XStack justifyContent="space-between" width="100%">
      <XStack gap={10} alignItems="center">
        <Square animation="quick" rotate={open ? '0deg' : '-90deg'}>
          <ChevronDown size={14} />
        </Square>
        <Text fontSize={14} fontWeight="bold">
          {t('settings.websearch.subscribe.title')}
        </Text>
      </XStack>
      <XStack gap={10} alignItems="center">
        <Button size={14} chromeless icon={<RefreshCcw size={14} />} onPress={onRefreshAllSubscriptions} />
        <Button
          size={14}
          circular
          chromeless
          backgroundColor="$green20"
          icon={<Plus size={14} color="$green100" />}
          onPress={onAddSubscription}
        />
      </XStack>
    </XStack>
  )

  return (
    <>
      <YStack gap={8} paddingVertical={8}>
        <SettingGroupTitle>{t('settings.websearch.blacklist.title')}</SettingGroupTitle>
        <SettingGroup>
          <TextArea
            numberOfLines={7}
            backgroundColor="$colorTransparent"
            borderWidth={0}
            placeholder={t('settings.websearch.blacklist_placeholder')}
            value={blacklistText}
            onChangeText={onBlacklistTextChange}
          />
        </SettingGroup>
        <Text fontSize={12} opacity={0.5}>
          {t('settings.websearch.blacklist_description')}
        </Text>
      </YStack>

      <Accordion type="single" collapsible width="100%">
        <Accordion.Item value="blacklist-subscription" marginBottom={8}>
          <Accordion.Trigger
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingVertical={12}
            paddingHorizontal={16}
            backgroundColor="$gray2"
            borderRadius={9}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}>
            {renderAccordionTriggerContent}
          </Accordion.Trigger>
          <Accordion.HeightAnimator animation="quicker">
            <Accordion.Content
              exitStyle={{ opacity: 0 }}
              backgroundColor="$gray1"
              borderBottomLeftRadius={9}
              borderBottomRightRadius={9}
              borderTopWidth={1}
              borderTopColor="$gray4"
              width="100%"
              paddingHorizontal={0}
              overflow="hidden">
              <YStack borderColor="white" width="100%" paddingVertical={8} gap={8} pointerEvents="box-none">
                {subscriptions.map(source => (
                  <SettingRow key={source.key}>
                    <Text>{source.name}</Text>
                    <XStack gap={8} alignItems="center" justifyContent="flex-end">
                      <Text>{source.url}</Text>
                      <Button
                        size={14}
                        chromeless
                        icon={<RefreshCcw size={14} />}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => onRefreshSubscription(source)}
                      />
                    </XStack>
                  </SettingRow>
                ))}
              </YStack>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>
    </>
  )
}
