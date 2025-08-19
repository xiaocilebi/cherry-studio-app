import { isEmpty } from 'lodash'
import { FC, memo } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-native-marked'
import { View } from 'tamagui'

import { MainTextMessageBlock, ThinkingMessageBlock, TranslationMessageBlock } from '@/types/message'
import { useIsDark } from '@/utils'
import { escapeBrackets, removeSvgEmptyLines } from '@/utils/formats'

import { useMarkedRenderer } from './useMarkedRenderer'

interface Props {
  block: MainTextMessageBlock | TranslationMessageBlock | ThinkingMessageBlock
}

const ReactNativeMarkdown: FC<Props> = ({ block }) => {
  const { t } = useTranslation()
  const isDark = useIsDark()

  const getMessageContent = (block: MainTextMessageBlock | TranslationMessageBlock | ThinkingMessageBlock) => {
    const empty = isEmpty(block.content)
    const paused = block.status === 'paused'
    const content = empty && paused ? t('message.chat.completion.paused') : block.content
    return removeSvgEmptyLines(escapeBrackets(content))
  }

  const messageContent = getMessageContent(block)

  const { renderer, tokenizer } = useMarkedRenderer(isDark)

  return (
    <View>
      <Markdown
        value={messageContent}
        renderer={renderer}
        tokenizer={tokenizer}
        flatListProps={{
          initialNumToRender: 8,
          showsVerticalScrollIndicator: false,
          style: {
            backgroundColor: 'transparent'
          }
        }}
      />
    </View>
  )
}

export default memo(ReactNativeMarkdown)
