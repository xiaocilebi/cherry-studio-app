import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Slider, XStack, YStack } from 'tamagui'

import { SettingGroup, SettingGroupTitle, SettingRow, SettingRowTitle } from '@/components/settings'
import { CustomSwitch } from '@/components/ui/Switch'
import { useWebsearchSettings } from '@/hooks/useWebsearchProviders'

export default function GeneralSettings() {
  const { t } = useTranslation()

  const {
    searchWithDates,
    overrideSearchService,
    searchCount,
    contentLimit,
    setSearchWithDates,
    setOverrideSearchService,
    setSearchCount,
    setContentLimit
  } = useWebsearchSettings()

  // Handler for search count change
  const handleSearchCountChange = (value: number[]) => {
    setSearchCount(value[0])
  }

  // Handler for content limit change
  const handleContentLimitChange = (value: string) => {
    const numValue = parseInt(value, 10)

    if (!isNaN(numValue)) {
      setContentLimit(numValue)
    } else if (value === '') {
      setContentLimit(undefined)
    }
  }

  return (
    <YStack gap={8} paddingVertical={8}>
      <SettingGroupTitle>{t('settings.general.title')}</SettingGroupTitle>
      <SettingGroup>
        <SettingRow>
          <SettingRowTitle>{t('settings.websearch.searchWithDates')}</SettingRowTitle>
          <CustomSwitch checked={searchWithDates} onCheckedChange={setSearchWithDates} />
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>{t('settings.websearch.overrideSearchService')}</SettingRowTitle>
          <CustomSwitch checked={overrideSearchService} onCheckedChange={setOverrideSearchService} />
        </SettingRow>
        <SettingRow>
          <YStack gap={10} flex={1}>
            <XStack justifyContent="space-between">
              <SettingRowTitle>{t('settings.websearch.searchCount')}</SettingRowTitle>
              <SettingRowTitle>{searchCount}</SettingRowTitle>
            </XStack>
            <Slider value={[searchCount]} min={1} max={20} step={1} onValueChange={handleSearchCountChange}>
              <Slider.Track backgroundColor="$green20">
                <Slider.TrackActive backgroundColor="$green100" />
              </Slider.Track>
              <Slider.Thumb backgroundColor="$green100" borderWidth={0} size={16} index={0} circular />
            </Slider>
          </YStack>
        </SettingRow>
        <SettingRow>
          <SettingRowTitle>{t('settings.websearch.contentLengthLimit')}</SettingRowTitle>
          <Input
            height={24}
            minWidth={52}
            paddingVertical={0}
            value={contentLimit?.toString() || ''}
            onChangeText={handleContentLimitChange}
            fontSize={14}
            lineHeight={14 * 1.2}
          />
        </SettingRow>
      </SettingGroup>
    </YStack>
  )
}
