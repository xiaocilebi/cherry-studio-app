import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import { FallbackFavicon } from '@/componentsV2/icons'
import { Citation } from '@/types/websearch'
import { haptic } from '@/utils/haptic'
import { CitationSheet, Text, YStack } from '@/componentsV2'

interface PreviewIconProps {
  citation: Citation
  index: number
  total: number
}

const PreviewIcon: React.FC<PreviewIconProps> = ({ citation, index, total }) => (
  <View
    className="w-[14px] h-[14px] rounded-full overflow-hidden flex items-center justify-center bg-transparent border border-transparent"
    style={[{ zIndex: total - index, marginLeft: index === 0 ? 0 : -2 }]}>
    <FallbackFavicon hostname={new URL(citation.url).hostname} alt={citation.title || ''} />
  </View>
)

interface CitationsListProps {
  citations: Citation[]
}

const CitationsList: React.FC<CitationsListProps> = ({ citations }) => {
  const { t } = useTranslation()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const previewItems = citations.slice(0, 3)
  const count = citations.length
  if (!count) return null

  const handlePress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetModalRef.current?.present()
  }

  return (
    <YStack className="my-[6px]">
      <TouchableOpacity
        className="self-start rounded-lg px-2 h-7 bg-green-10 border border-green-20 dark:bg-green-dark-10 dark:border-green-dark-20 flex-row items-center gap-2"
        onPress={handlePress}>
        <View className="flex-row items-center">
          {previewItems.map((c, i) => (
            <PreviewIcon key={i} citation={c} index={i} total={previewItems.length} />
          ))}
        </View>
        <Text className="text-[10px] text-green-100 dark:text-green-dark-100">{t('chat.citation', { count })}</Text>
      </TouchableOpacity>
      <CitationSheet ref={bottomSheetModalRef} citations={citations} />
    </YStack>
  )
}

export default CitationsList
