import { Camera as CameraIcon, FolderClosed, Image } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

interface ToolOption {
  key: string
  label: string
  icon: React.ReactNode
  onPress: () => void
}

interface ToolOptionsProps {
  onCameraPress: () => void
  onImagePress: () => void
  onFilePress: () => void
}

export const ToolOptions: React.FC<ToolOptionsProps> = ({ onCameraPress, onImagePress, onFilePress }) => {
  const { t } = useTranslation()

  const options: ToolOption[] = [
    {
      key: 'camera',
      label: t('common.camera'),
      icon: <CameraIcon size={24} />,
      onPress: onCameraPress
    },
    {
      key: 'photo',
      label: t('common.photo'),
      icon: <Image size={24} />,
      onPress: onImagePress
    },
    {
      key: 'file',
      label: t('common.file'),
      icon: <FolderClosed size={24} />,
      onPress: onFilePress
    }
  ]

  return (
    <XStack gap={12} paddingHorizontal={20} justifyContent="space-between">
      {options.map(option => (
        <Button
          key={option.key}
          backgroundColor="$gray20"
          aspectRatio={1.618}
          onPress={option.onPress}
          justifyContent="center"
          alignItems="center"
          flex={1}>
          <YStack gap={8} alignItems="center">
            {option.icon}
            <Text color="$textPrimary" fontSize={14} textAlign="center">
              {option.label}
            </Text>
          </YStack>
        </Button>
      ))}
    </XStack>
  )
}
