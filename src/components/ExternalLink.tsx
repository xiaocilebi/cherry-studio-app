import * as ExpoLinking from 'expo-linking'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, OpaqueColorValue } from 'react-native'
import { GetThemeValueForKey, Text } from 'tamagui'

import { loggerService } from '@/services/LoggerService'

import { IconButton } from './ui/IconButton'
const logger = loggerService.withContext('External Link Component')

interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  color?: 'unset' | GetThemeValueForKey<'color'> | OpaqueColorValue
  size?: number
  onError?: (error: Error) => void
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, color = '$textLink', size, onError }) => {
  const { t } = useTranslation()

  const handlePress = async () => {
    const supported = await ExpoLinking.canOpenURL(href)

    if (supported) {
      try {
        await ExpoLinking.openURL(href)
      } catch (error) {
        const message = t('errors.cannotOpenLink', {
          error: error instanceof Error ? error.message : String(error)
        })
        logger.error('External Link Press', error)

        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)))
        } else {
          Alert.alert(t('errors.linkErrorTitle'), message)
        }
      }
    } else {
      const message = t('errors.deviceCannotHandleLink', { href })
      logger.warn('External Link Not Supported', message)

      if (onError) {
        onError(new Error(message))
      } else {
        Alert.alert(t('errors.cannotOpenLinkTitle'), message)
      }
    }
  }

  const content =
    typeof children === 'string' ? (
      <Text alignItems="center" justifyContent="center" color={color} fontSize={size}>
        {children}
      </Text>
    ) : (
      children
    )

  return <IconButton icon={content} onPress={handlePress} />
}

export default ExternalLink
