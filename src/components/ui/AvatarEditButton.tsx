import React from 'react'
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard'
import { Button, Stack, Text, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { useTheme } from '@/hooks/useTheme'

interface AvatarEditButtonProps {
  /** 头像内容 - 可以是 emoji 字符串或 React 节点（如图标） */
  content: string | React.ReactNode
  /** 编辑按钮图标 */
  editIcon: React.ReactNode
  /** 头像大小，默认 120 */
  size?: number
  /** 编辑按钮大小，默认 40 */
  editButtonSize?: number
  /** 编辑按钮点击事件 */
  onEditPress?: () => void
  updateAvatar: (avatar: string) => Promise<void>
}

export function AvatarEditButton({
  content,
  editIcon,
  size = 120,
  editButtonSize = 40,
  updateAvatar
}: AvatarEditButtonProps) {
  const { isDark } = useTheme()
  const isEmoji = typeof content === 'string'
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const handlePick = async (emoji: EmojiType) => {
    setIsOpen(prev => !prev)
    await updateAvatar(emoji.emoji)
  }

  return (
    <YStack position="relative">
      <Button
        size={size}
        circular
        borderColor="$green100"
        borderWidth={5}
        overflow="hidden"
        onPress={() => setIsOpen(prev => !prev)}
        // 如果是图标，需要调整内边距
        {...(!isEmoji && {
          paddingTop: 12,
          paddingLeft: 19
        })}>
        {isEmoji ? <Text fontSize={size * 0.58}>{content}</Text> : content}
      </Button>

      <Stack
        height={editButtonSize}
        width={editButtonSize}
        position="absolute"
        borderRadius={99}
        bottom={0}
        right={0}
        backgroundColor="$green100"
        zIndex={10}>
        <LinearGradient
          width="100%"
          height="100%"
          borderRadius={99}
          colors={['$green100', '#00B96B']}
          start={[1, 1]}
          end={[0, 0]}
          justifyContent="center"
          alignItems="center">
          {editIcon}
        </LinearGradient>
      </Stack>
      <EmojiPicker
        onEmojiSelected={handlePick}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        categoryPosition="top"
        theme={{
          container: isDark ? '#19191cff' : '#ffffffff',
          header: isDark ? '#f9f9f9ff' : '#202020ff',
          category: {
            icon: '#00b96bff',
            iconActive: '#fff',
            container: isDark ? '#19191cff' : '#ffffffff',
            containerActive: '#00b96bff'
          }
        }}
      />
    </YStack>
  )
}
