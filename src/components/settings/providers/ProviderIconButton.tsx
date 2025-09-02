import { PenLine } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { Button, Stack, YStack } from 'tamagui'
import { Image } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { DefaultProviderIcon } from '@/components/icons/DefaultProviderIcon'
import { uploadFiles } from '@/services/FileService'
import { loggerService } from '@/services/LoggerService'
import { FileType } from '@/types/file'
import { getFileType } from '@/utils/file'

const logger = loggerService.withContext('ProviderIconButton')
interface ProviderIconButtonProps {
  providerId: string
}

export function ProviderIconButton({ providerId }: ProviderIconButtonProps) {
  const [image, setImage] = useState<string | null>(null)

  const handleUploadIcon = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
        const file: Omit<FileType, 'md5'> = {
          id: providerId,
          name: result.assets[0].fileName || providerId,
          origin_name: result.assets[0].fileName || providerId,
          path: result.assets[0].uri,
          size: result.assets[0].fileSize || 0,
          ext: result.assets[0].fileName?.split('.').pop() || 'png',
          type: getFileType(result.assets[0].fileName?.split('.').pop() || 'png'),
          mime_type: result.assets[0].mimeType || '',
          created_at: new Date().toISOString(),
          count: 1
        }
        await uploadFiles([file])
      }
    } catch (error) {
      logger.error('handleUploadIcon Error', error)
    }
  }

  return (
    <YStack position="relative">
      <Button
        size={120}
        circular
        borderColor="$green100"
        borderWidth={5}
        overflow="hidden"
        {...(!image && {
          paddingTop: 12,
          paddingLeft: 19
        })}
        onPress={handleUploadIcon}>
        {image ? <Image source={{ uri: image }} height={120} width={120} /> : <DefaultProviderIcon />}
      </Button>

      <Stack
        height={40}
        width={40}
        position="absolute"
        borderRadius={99}
        bottom={0}
        right={0}
        backgroundColor="$green100"
        zIndex={10}
        cursor="pointer">
        <LinearGradient
          width="100%"
          height="100%"
          borderRadius={99}
          colors={['$green100', '#00B96B']}
          start={[1, 1]}
          end={[0, 0]}
          justifyContent="center"
          alignItems="center">
          <PenLine size={24} />
        </LinearGradient>
      </Stack>
    </YStack>
  )
}
