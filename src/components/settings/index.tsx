import { MotiView } from 'moti'
import { Appearance, Keyboard } from 'react-native'
import { Separator, styled, XStack, YStack } from 'tamagui'
import { Text, View } from 'tamagui'

import { getUiCardColor } from '@/utils/color'

// export const SettingContainer = styled(YStack, {
//   flex: 1,
//   padding: '$4',
//   gap: '20',
//   backgroundColor: '$background',
//   onPress: Keyboard.dismiss,
//   overflow: 'hidden'
// })
const isDark = Appearance.getColorScheme() === 'dark'

export const SettingContainer = styled(MotiView, {
  flex: 1,
  padding: '$4',
  gap: 20,
  backgroundColor: '$colorTransparent',
  overflow: 'hidden',

  from: {
    opacity: 0,
    translateY: 10
  },
  animate: {
    translateY: 0,
    opacity: 1
  },
  exit: {
    opacity: 0,
    translateY: -10
  },
  // transition: {
  //   type: 'timing'
  // },

  onStartShouldSetResponder: () => true,
  onResponderRelease: Keyboard.dismiss,

  name: 'SettingContainer'
})

export const SettingTitle = styled(Text, {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  userSelect: 'none',
  fontSize: 14,
  fontWeight: 'bold',
  paddingBlockEnd: 24
})

export const SettingSubtitle = styled(Text, {
  fontSize: 14,
  color: 'var(--color-text-1)',
  margin: '15px 0 0 0',
  userSelect: 'none',
  fontWeight: 'bold'
})

export const SettingDescription = styled(Text, {
  fontSize: 12,
  color: 'var(--color-text-3)',
  marginTop: 10
})

export const SettingDivider = styled(Separator, {
  margin: '10px 0',
  borderWidth: 0.5,
  borderStyle: 'solid'
  // borderColor: 'var(--color-border)'
})

export const SettingRow = styled(XStack, {
  borderRadius: 9,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  paddingLeft: 16,
  paddingRight: 20,
  backgroundColor: '$colorTransparent'
})

export const SettingRowTitle = styled(Text, {
  fontSize: 14
})

export const SettingHelpTextRow = styled(View, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '5px 0'
})

export const SettingHelpText = styled(Text, {
  fontSize: 11,
  opacity: 0.4
})

export const SettingGroup = styled(YStack, {
  // flex: 1,
  gap: 8,
  paddingVertical: 8,
  borderRadius: 9,
  backgroundColor: getUiCardColor(isDark)
})

export const SettingGroupTitle = styled(Text, {
  fontWeight: 'bold',
  opacity: 0.7
})
