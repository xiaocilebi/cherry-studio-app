import { FC, memo, useMemo } from 'react'
import React from 'react'
import { View, XStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import {
  CitationMessageBlock,
  MainTextMessageBlock,
  MessageBlock,
  MessageBlockStatus,
  MessageBlockType
} from '@/types/message'

import CitationBlock from './CitationBlock'
import ErrorBlock from './ErrorBlock'
import FileBlock from './FileBlock'
import ImageBlock from './ImageBlock'
import MainTextBlock from './MainTextBlock'
import PlaceholderBlock from './PlaceholderBlock'
import ThinkingBlock from './ThinkingBlock'
import ToolBlock from './ToolBlock'
import TranslationBlock from './TranslationBlock'
const logger = loggerService.withContext('Message Blocks Index')

interface MessageBlockRendererProps {
  blocks: MessageBlock[]
}

/**
 * Pre-processes message blocks for rendering.
 * 1. Separates citation blocks to be rendered at the end.
 * 2. Groups consecutive media blocks (IMAGE, FILE) together.
 * @param blocks The source message blocks.
 * @returns An object containing content blocks (with media grouped) and citation blocks.
 */
const prepareBlocksForRender = (blocks: MessageBlock[]) => {
  const citationBlocks: CitationMessageBlock[] = []
  const otherBlocks: MessageBlock[] = []

  for (const block of blocks) {
    if (block.type === MessageBlockType.CITATION) {
      citationBlocks.push(block)
    } else {
      otherBlocks.push(block)
    }
  }

  const contentBlocks = otherBlocks.reduce((acc: (MessageBlock[] | MessageBlock)[], currentBlock) => {
    if (currentBlock.type === MessageBlockType.IMAGE || currentBlock.type === MessageBlockType.FILE) {
      const prevGroup = acc[acc.length - 1]

      if (Array.isArray(prevGroup) && prevGroup[0]?.type === currentBlock.type) {
        prevGroup.push(currentBlock)
      } else {
        acc.push([currentBlock])
      }
    } else {
      acc.push(currentBlock)
    }

    return acc
  }, [])
  return { contentBlocks, citationBlocks }
}

const MessageBlockRenderer: FC<MessageBlockRendererProps> = ({ blocks }) => {
  const { contentBlocks, citationBlocks } = useMemo(() => prepareBlocksForRender(blocks), [blocks])
  return (
    <View flex={1} width="100%" maxWidth="100%" style={{ gap: 5 }}>
      {contentBlocks.map(blockOrGroup => {
        if (Array.isArray(blockOrGroup)) {
          const groupKey = blockOrGroup[0]?.id || 'media-group'
          return (
            <View key={groupKey} width="100%">
              <XStack flexWrap="wrap" gap="5" width="100%">
                {blockOrGroup.map(block => {
                  switch (block.type) {
                    case MessageBlockType.IMAGE:
                      return <ImageBlock key={block.id} block={block} />
                    case MessageBlockType.FILE:
                      return <FileBlock key={block.id} block={block} />
                    default:
                      return null
                  }
                })}
              </XStack>
            </View>
          )
        }

        const block = blockOrGroup
        let blockComponent: React.ReactNode = null

        switch (block.type) {
          case MessageBlockType.UNKNOWN:
            if (block.status === MessageBlockStatus.PROCESSING) {
              blockComponent = <PlaceholderBlock key={block.id} block={block} />
            }

            break
          case MessageBlockType.MAIN_TEXT:

          case MessageBlockType.CODE: {
            const mainTextBlock = block as MainTextMessageBlock
            const citationBlockId = mainTextBlock.citationReferences?.[0]?.citationBlockId
            blockComponent = <MainTextBlock key={block.id} block={mainTextBlock} citationBlockId={citationBlockId} />
            break
          }

          case MessageBlockType.IMAGE:
            blockComponent = <ImageBlock key={block.id} block={block} />
            break
          case MessageBlockType.FILE:
            blockComponent = <FileBlock key={block.id} block={block} />
            break
          case MessageBlockType.THINKING:
            blockComponent = <ThinkingBlock key={block.id} block={block} />
            break
          case MessageBlockType.TRANSLATION:
            blockComponent = <TranslationBlock key={block.id} block={block} />
            break
          case MessageBlockType.TOOL:
            blockComponent = <ToolBlock key={block.id} block={block} />
            break
          case MessageBlockType.ERROR:
            blockComponent = <ErrorBlock key={block.id} block={block} />
            break
          default:
            logger.warn('Unsupported block type in MessageBlockRenderer:', (block as any).type, block)
            break
        }

        return <View key={block.type === MessageBlockType.UNKNOWN ? 'placeholder' : block.id}>{blockComponent}</View>
      })}
      {citationBlocks.map(block => (
        <CitationBlock key={block.id} block={block} />
      ))}
    </View>
  )
}

export default memo(MessageBlockRenderer)
