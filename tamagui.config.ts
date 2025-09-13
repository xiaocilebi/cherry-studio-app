import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'

const newColorTokens = {
  colorBrand: '#00b96bff',
  purple100: '#9c96f9ff',
  purple20: '#9c96f933',
  orange100: '#ffb26eff',
  orange20: '#ffb26e33',
  orange10: '#ffb26e1a',
  blue100: '#6fb1faff',
  blue20: '#6fb1fa33',
  blue10: '#6fb1fa1a',
  pink100: '#e398c9ff',
  pink20: '#e398c933',
  red100: '#ff0000ff',
  red20: '#ff000033',
  red10: '#ff00001a',
  gray80: '#a0a1b0cc',
  gray60: '#a0a1b099',
  gray40: '#a0a1b066',
  gray20: '#a0a1b033',
  gray10: '#a0a1b01a',
  yellow100: '#F9EA42FF',
  yellow20: '#F9EA4233',
  textDelete: '#dc3e42ff',
  textLink: '#0090ffff'
}
// 扩展配置，添加borderColor
const extendedConfig = {
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      // ...config.tokens.color,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderColorDark: 'rgba(255, 255, 255, 0.15)',
      cardBackground: '',
      CardBackgroundDark: '#17171b',
      backgroundGreen: 'rgba(0, 185, 107, 0.2)',
      foregroundGreen: 'rgba(0, 185, 107, 1)',
      backgroundRed: 'rgba(216, 57, 31, 0.2)',
      foregroundRed: 'rgba(216, 57, 31, 1)',
      backgroundBlue: 'rgba(28, 128, 254, 0.2)',
      foregroundBlue: 'rgba(28, 128, 254, 1)',
      backgroundPurple: 'rgba(114, 105, 255, 0.2)',
      foregroundPurple: 'rgba(114, 105, 255, 1)',
      backgroundOrange: 'rgba(242, 136, 57, 0.2)',
      foregroundOrange: 'rgba(242, 136, 57, 1)',
      backgroundYellow: 'rgba(255, 202, 0, 0.2)',
      foregroundYellow: 'rgba(255, 202, 0, 1)',
      backgroundDarkPurple: 'rgba(56, 67, 255, 0.2)',
      foregroundDarkPurple: 'rgba(56, 67, 255, 1)',
      backgroundGray: 'rgba(135, 142, 168, 0.2)',
      foregroundGray: 'rgba(135, 142, 168, 1)',
      ...newColorTokens
    }
  },
  themes: {
    light: {
      ...config.themes.light,
      uiCardBackground: '#ffffffff',
      colorBorderLinear: '#000000ff',
      green100: '#81df94ff',
      green20: '#8de59e4d',
      green10: '#8de59e26',
      yellow100: '#f2e218ff',
      yellow20: '#f2e21833',
      backgroundPrimary: '#f7f7f7ff',
      backgroundSecondary: '#ffffff99',
      uiCard: '#ffffffff',
      textPrimary: '#202020ff',
      textSecondary: '#646464ff',
      backgroundOpacity: '#ffffffff'
    },
    dark: {
      ...config.themes.dark,
      uiCardBackground: '#19191cff',
      colorBorderLinear: '#ffffffff',
      green100: '#acf3a6ff',
      green20: '#acf3a633',
      green10: '#acf3a61a',
      yellow100: '#f9ea42ff',
      yellow20: '#f9ea4233',
      backgroundPrimary: '#121213ff',
      backgroundSecondary: '#20202099',
      uiCard: '#19191cff',
      textPrimary: '#f9f9f9ff',
      textSecondary: '#cececeff',
      backgroundOpacity: 'rgba(34,34,34,0.7)'
    }
  }
}

export const tamaguiConfig = createTamagui(extendedConfig)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {
    foo: string
  }
}
