import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useWindowDimensions } from 'tamagui'

const ImageSkeleton = props => {
  const { width: screenWidth } = useWindowDimensions()
  // Default size is 30% of the screen width, (32 is the padding on both sides)
  const imageWidth = props.size ? props.size : (screenWidth - 32) * 0.3
  return (
    <ContentLoader
      speed={1}
      width={imageWidth}
      height={imageWidth}
      viewBox="0 0 400 400"
      backgroundColor="#BFBFBF"
      foregroundColor="#F0F0F0"
      {...props}>
      <Rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
    </ContentLoader>
  )
}

export default ImageSkeleton
