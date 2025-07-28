import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Image, Text, YStack } from 'tamagui'

interface EmptyModelViewProps {
  onAddModel?: () => void
}

export const EmptyModelView: React.FC<EmptyModelViewProps> = ({ onAddModel }) => {
  const { t } = useTranslation()

  return (
    <YStack gap={87} paddingVertical={100} alignItems="center">
      <Image source={require('@/assets/images/error/no_model.png')} />
      <YStack gap={51} width="100%" alignItems="center">
        <YStack gap={12}>
          <Text fontSize={30} fontWeight="bold" textAlign="center">
            {t('settings.models.empty')}
          </Text>
          <Text fontSize={16} textAlign="center">
            {t('settings.models.empty.tooltip')}
          </Text>
        </YStack>
        <Button width="100%" height={42} borderColor="$color12" borderWidth={1} alignSelf="center" onPress={onAddModel}>
          <Text fontSize={16} fontWeight="bold">
            {t('settings.models.empty.add_model')}
          </Text>
        </Button>
      </YStack>
    </YStack>
  )
}
