import React from 'react'
import { FC } from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { View } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'

const AssistantItemSkeleton: FC = () => {
  const { isDark } = useTheme()
  return (
    <View paddingVertical={10} paddingHorizontal={10} borderRadius={16} backgroundColor="$uiCardBackground">
      <ContentLoader
        height={46}
        width={300}
        speed={1}
        backgroundColor={isDark ? '#333333' : '#eeeeee'}
        foregroundColor={isDark ? '#555555' : '#cccccc'}
        viewBox="0 0 300 46">
        <Rect x="0" y="0" rx="18" ry="18" width="46" height="46" />

        <Rect x="60" y="8" rx="4" ry="4" width="120" height="14" />

        <Rect x="60" y="26" rx="3" ry="3" width="180" height="12" />
      </ContentLoader>
    </View>
  )
}

export default AssistantItemSkeleton
