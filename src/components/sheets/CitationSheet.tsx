import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { X } from '@tamagui/lucide-icons'
import * as ExpoLinking from 'expo-linking'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, TouchableOpacity } from 'react-native'
import { Stack, Text, View, XStack, YStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { loggerService } from '@/services/LoggerService'
import { Citation } from '@/types/websearch'
import { getWebsiteBrand } from '@/utils/websearch'

import { FallbackFavicon } from '@/componentsV2/icons'
const logger = loggerService.withContext('Citation Sheet')

interface CitationSheetProps {
  citations: Citation[]
}

const CitationTitle = ({ number, title }: { number: number; title: string }) => {
  return (
    <XStack gap={10} alignItems="center">
      <Stack
        borderRadius={99}
        borderWidth={0.5}
        padding={3}
        justifyContent="center"
        alignItems="center"
        borderColor="$green20"
        backgroundColor="$green10"
        minWidth={20}>
        <Text fontSize={10} textAlign="center" color="$green100">
          {number}
        </Text>
      </Stack>
      <Stack flex={1}>
        <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </Stack>
    </XStack>
  )
}

const Content = ({ content }: { content: string }) => (
  <XStack marginTop={4}>
    <Text fontSize={12} lineHeight={16} numberOfLines={3} color="$textSecondary" ellipsizeMode="tail">
      {content}
    </Text>
  </XStack>
)

const Footer = ({ url, title }: { url: string; title: string }) => (
  <XStack gap={6} alignItems="center" marginTop={4}>
    <FallbackFavicon hostname={new URL(url).hostname} alt={title || ''} />
    <Text lineHeight={20} fontSize={10}>
      {getWebsiteBrand(url)}
    </Text>
  </XStack>
)

const CitationCard = ({ citation, onPress }: { citation: Citation; onPress: (url: string) => void }) => {
  return (
    <YStack paddingVertical={10} gap={5}>
      <TouchableOpacity onPress={() => onPress(citation.url)}>
        <CitationTitle number={citation.number} title={citation.title || ''} />
        <Content content={citation.content || ''} />
        <Footer url={citation.url} title={citation.title || ''} />
      </TouchableOpacity>
    </YStack>
  )
}

const CitationSheet = forwardRef<BottomSheetModal, CitationSheetProps>(({ citations }, ref) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [ref, isVisible])

  // 添加背景组件渲染函数
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const handlePress = async (url: string) => {
    const supported = await ExpoLinking.canOpenURL(url)

    if (supported) {
      try {
        await ExpoLinking.openURL(url)
      } catch (error) {
        const message = t('errors.cannotOpenLink', {
          error: error instanceof Error ? error.message : String(error)
        })
        logger.error(message, error)
      }
    } else {
      const message = t('errors.deviceCannotHandleLink', { url })
      logger.warn(message)
    }
  }

  return (
    <BottomSheetModal
      snapPoints={['40%', '90%']}
      enableDynamicSizing={false}
      ref={ref}
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
      }}
      onDismiss={() => setIsVisible(false)}
      onChange={index => setIsVisible(index >= 0)}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={16}
        paddingBottom={16}
        borderBottomWidth={1}
        borderBottomColor="$borderColor">
        <Text fontSize={16} fontWeight="bold">
          {t('common.source')}
        </Text>
        <TouchableOpacity
          style={{
            padding: 4,
            backgroundColor: isDark ? '#333333' : '#dddddd',
            borderRadius: 16
          }}
          onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={16} />
        </TouchableOpacity>
      </XStack>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 10
        }}>
        {citations.map((citation, index) => (
          <View key={index} borderBottomWidth={index < citations.length - 1 ? 1 : 0} borderBottomColor="$borderColor">
            <CitationCard citation={citation} onPress={handlePress} />
          </View>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

CitationSheet.displayName = 'CitationSheet'

export default CitationSheet
