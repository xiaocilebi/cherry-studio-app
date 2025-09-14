import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, YStack } from 'tamagui'

export const EmptyModelView: React.FC = () => {
  const { t } = useTranslation()

  return (
    <YStack gap={51} width="100%" alignItems="center">
      <YStack gap={12}>
        <Text fontSize={30} fontWeight="bold" textAlign="center">
          {t('settings.models.empty')}
        </Text>
      </YStack>
    </YStack>
  )
}
