import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'tamagui'

import FallbackFavicon from '@/components/icons/FallbackFavicon'
import CitationSheet from '@/components/sheets/CitationSheet'
import { Citation } from '@/types/websearch'
import { haptic } from '@/utils/haptic'
import { ImpactFeedbackStyle } from 'expo-haptics'

interface PreviewIconProps {
  citation: Citation
  index: number
  total: number
}

const PreviewIcon: React.FC<PreviewIconProps> = ({ citation, index, total }) => (
  <View style={[styles.previewIcon, index === 0 && styles.firstPreviewIcon, { zIndex: total - index }]}>
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
    <View marginVertical={6}>
      <Button
        chromeless
        alignSelf="flex-start"
        borderRadius={16}
        padding={5}
        height={26}
        backgroundColor="$green10"
        borderColor="$green20"
        flexDirection="row"
        alignItems="center"
        onPress={handlePress}>
        {/* 使用 styles.previewIcons */}
        <View style={styles.previewIcons}>
          {previewItems.map((c, i) => (
            <PreviewIcon key={i} citation={c} index={i} total={previewItems.length} />
          ))}
        </View>
        <Text fontSize={10} color="$green100">
          {t('chat.citation', { count })}
        </Text>
      </Button>
      <CitationSheet ref={bottomSheetModalRef} citations={citations} />
    </View>
  )
}

const styles = StyleSheet.create({
  previewIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  previewIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    marginLeft: -2
  },
  firstPreviewIcon: {
    marginLeft: 0
  }
})

export default CitationsList
