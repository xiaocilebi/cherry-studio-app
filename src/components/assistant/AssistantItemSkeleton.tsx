import React from 'react'
import { FC } from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'

const AssistantItemSkeleton: FC = () => {
  return (
    <ContentLoader
      height={45}
      width="100%"
      speed={1}
      backgroundColor={'#333'}
      foregroundColor={'#999'}
      viewBox="0 0 520 70">
      {/* Only SVG shapes */}
      <Rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
      <Rect x="80" y="17" rx="4" ry="4" width="400" height="13" />
      <Rect x="80" y="40" rx="3" ry="3" width="350" height="10" />
    </ContentLoader>
  )
}

export default AssistantItemSkeleton
