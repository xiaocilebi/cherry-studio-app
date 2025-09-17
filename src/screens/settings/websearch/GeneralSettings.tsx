import React from 'react'
import { useTranslation } from 'react-i18next'

import { Group, GroupTitle, Row, TextField, YStack } from '@/componentsV2'
import { SettingRowTitle } from '@/components/settings'
import { useWebsearchSettings } from '@/hooks/useWebsearchProviders'
import { Switch } from 'heroui-native'

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
  const handleSearchCountChange = (value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setSearchCount(numValue)
    } else if (value === '') {
      setSearchCount(1)
    }
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
    <YStack className="gap-2 py-2">
      <GroupTitle>{t('settings.general.title')}</GroupTitle>
      <Group>
        <Row>
          <SettingRowTitle>{t('settings.websearch.contentLengthLimit')}</SettingRowTitle>
          <TextField className="flex-1 max-w-20">
            <TextField.Input value={contentLimit?.toString() || ''} onChangeText={handleContentLimitChange} />
          </TextField>
        </Row>
        <Row>
          <SettingRowTitle>{t('settings.websearch.searchCount')}</SettingRowTitle>
          <TextField className="flex-1 max-w-20">
            <TextField.Input value={searchCount.toString()} onChangeText={handleSearchCountChange} />
          </TextField>
        </Row>

        <Row>
          <SettingRowTitle>{t('settings.websearch.searchWithDates')}</SettingRowTitle>
          <Switch color="success" isSelected={searchWithDates} onSelectedChange={setSearchWithDates} />
        </Row>
        <Row>
          <SettingRowTitle>{t('settings.websearch.overrideSearchService')}</SettingRowTitle>
          <Switch color="success" isSelected={overrideSearchService} onSelectedChange={setOverrideSearchService} />
        </Row>
      </Group>
    </YStack>
  )
}
