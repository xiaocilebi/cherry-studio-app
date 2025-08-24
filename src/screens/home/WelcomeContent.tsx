import React from 'react'
import { Keyboard } from 'react-native'
import { View } from 'tamagui'
import { Image } from 'tamagui'

const WelcomeContent = () => {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}
      onPress={() => Keyboard.dismiss()}>
      <Image
        source={require('@/assets/images/favicon.png')}
        width={100}
        height={100}
        objectFit="contain"
        borderRadius={20}
        overflow="hidden"
      />
    </View>
  )
}

export default WelcomeContent
