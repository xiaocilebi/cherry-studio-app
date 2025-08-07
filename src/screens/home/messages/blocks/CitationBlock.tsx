import React from 'react'
import { View } from 'react-native'

import { CitationMessageBlock } from '@/types/message'
import { formatCitationsFromBlock } from '@/utils/formats'

import CitationsList from '../CitationLIst'

function CitationBlock({ block }: { block: CitationMessageBlock }) {
  const formattedCitations = formatCitationsFromBlock(block)

  return (
    <View>
      <CitationsList citations={formattedCitations} />
    </View>
  )
}

export default CitationBlock
