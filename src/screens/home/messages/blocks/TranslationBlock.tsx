import { Languages } from '@tamagui/lucide-icons'
import { FC } from 'react'
import React from 'react'
import { Separator, View, XStack } from 'tamagui'

import { TranslationMessageBlock } from '@/types/message'

import ReactNativeMarkdown from '../../markdown/ReactNativeMarkdown'

interface Props {
  block: TranslationMessageBlock
}

const TranslationBlock: FC<Props> = ({ block }) => {
  return (
    <View>
      <XStack flex={1} justifyContent="center" alignItems="center" gap={10}>
        <Separator borderColor="$gray40" />
        <Languages size={16} />
        <Separator borderColor="$gray40" />
      </XStack>
      <ReactNativeMarkdown block={block} />
    </View>
  )
}

export default TranslationBlock
