import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { Image, Text, View } from 'tamagui'

const WelcomeContent = () => {
  const { t } = useTranslation()

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
      <Text fontSize={18} fontWeight="bold" color="$primary" marginTop={20}>
        {t('chat.title')}
      </Text>
    </View>
  )
}

export default WelcomeContent
