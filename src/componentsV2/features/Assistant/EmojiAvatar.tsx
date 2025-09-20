import { BlurView } from 'expo-blur'
import React from 'react'
import { Platform, View } from 'react-native'
import { cn } from 'heroui-native'

import { useTheme } from '@/hooks/useTheme'
import { formateEmoji } from '@/utils/formats'
import YStack from '@/componentsV2/layout/YStack'
import Text from '@/componentsV2/base/Text'

interface EmojiAvatarProps {
  emoji?: string
  size?: number
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  blurIntensity?: number
}

const EmojiAvatar = ({
  emoji,
  size = 80,
  borderWidth = 4,
  borderColor = '$backgroundPrimary',
  borderRadius,
  blurIntensity = 80
}: EmojiAvatarProps) => {
  const { isDark } = useTheme()

  return (
    <View
      className={cn('relative overflow-hidden items-center justify-center')}
      style={{
        height: size,
        width: size,
        borderWidth,
        borderColor,
        borderRadius: borderRadius || size / 2
      }}>
      {/* 背景模糊emoji */}
      <YStack
        className="absolute inset-0 items-center justify-center scale-[2] origin-center"
        style={{
          height: size - borderWidth * 2,
          width: size - borderWidth * 2
        }}>
        <Text className="opacity-30" style={{ fontSize: size * 0.7 }}>
          {formateEmoji(emoji)}
        </Text>
      </YStack>
      {/* BlurView模糊层 */}
      <BlurView
        intensity={blurIntensity}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
        tint={isDark ? 'dark' : 'light'}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: size / 2
        }}
      />
      {/* 前景清晰emoji */}
      <Text style={{ fontSize: size * 0.5 }}>{formateEmoji(emoji)}</Text>
    </View>
  )
}

export default EmojiAvatar
