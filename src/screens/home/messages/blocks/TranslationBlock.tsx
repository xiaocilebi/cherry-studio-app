import { Languages } from '@tamagui/lucide-icons'
import React, { FC } from 'react'
import { View } from 'react-native'
import { Divider } from 'heroui-native'
import { XStack } from '@/componentsV2'

import { TranslationMessageBlock } from '@/types/message'

import ReactNativeMarkdown from '../../markdown/ReactNativeMarkdown'

interface Props {
  block: TranslationMessageBlock
}

const TranslationBlock: FC<Props> = ({ block }) => {
  return (
    <View>
      <XStack className="justify-center items-center gap-2.5">
        <Divider className="flex-1 bg-gray-40" thickness={1} />
        <Languages size={16} />
        <Divider className="flex-1 bg-gray-40" thickness={1} />
      </XStack>
      <ReactNativeMarkdown block={block} />
    </View>
  )
}

export default TranslationBlock
