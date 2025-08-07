export function getGreenColor(isDark: boolean, op: number) {
  return isDark ? `$green${op}Dark` : `$green${op}Light`
}

export function getTextPrimaryColor(isDark: boolean) {
  return isDark ? '$textPrimaryDark' : '$textPrimaryLight'
}

export function getTextSecondaryColor(isDark: boolean) {
  return isDark ? '$textSecondaryDark' : '$textSecondaryLight'
}

export function getBackgroundColor(isDark: boolean) {
  return isDark ? '$backgroundPrimaryDark' : '$backgroundPrimaryLight'
}

export function getUiCardColor(isDark: boolean) {
  return isDark ? '$uiCardDark' : '$uiCardLight'
}
