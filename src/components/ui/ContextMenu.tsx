import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { FC, useRef } from 'react'
import React from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import { SFSymbol } from 'sf-symbols-typescript'
import { Text, YStack } from 'tamagui'
import { XStack } from 'tamagui'
import * as ZeegoContextMenu from 'zeego/context-menu'

import { useTheme } from '@/hooks/useTheme'
import { isAndroid, isIOS } from '@/utils/device'

export interface ContextMenuListProps {
  title: string
  iOSIcon?: SFSymbol
  androidIcon?: React.ReactNode
  destructive?: boolean
  color?: string
  onSelect: () => void
}

export interface ContextMenuProps {
  children: React.ReactNode
  disableContextMenu?: boolean
  borderRadius?: number
  /** 解决子元素有ScrollView时无法横向滚动问题 */
  withHighLight?: boolean
  onPress?: () => void
  list: ContextMenuListProps[]
}

const ContextMenu: FC<ContextMenuProps> = ({
  children,
  onPress = () => {},
  list,
  disableContextMenu = false,
  borderRadius = 0,
  withHighLight = true
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { isDark } = useTheme()

  if (isIOS) {
    const { Root, Trigger, Content, Item, ItemTitle, ItemIcon } = ZeegoContextMenu
    const TriggerContent = withHighLight ? (
      <Pressable
        onPress={onPress}
        onLongPress={() => {}}
        unstable_pressDelay={50}
        delayLongPress={400}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#a0a1b033' : 'transparent',
          borderRadius
        })}>
        {children}
      </Pressable>
    ) : (
      children
    )

    if (disableContextMenu) {
      return TriggerContent
    }

    return (
      <Root
        // @ts-expect-error: https://github.com/nandorojo/zeego/issues/80
        __unsafeIosProps={{
          shouldWaitForMenuToHideBeforeFiringOnPressMenuItem: false
        }}>
        <Trigger disabled={disableContextMenu}>{TriggerContent}</Trigger>
        <Content>
          {list.map(item => (
            <Item key={item.title} onSelect={item.onSelect} destructive={item.destructive}>
              <ItemTitle>{item.title}</ItemTitle>
              {item.iOSIcon && <ItemIcon ios={{ name: item.iOSIcon }} />}
            </Item>
          ))}
        </Content>
      </Root>
    )
  }

  if (isAndroid) {
    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    )

    const openBottomSheet = () => {
      if (disableContextMenu) return
      bottomSheetModalRef.current?.present()
    }

    const closeBottomSheet = () => {
      bottomSheetModalRef.current?.dismiss()
    }

    const onAndroidSelect = (fn: () => void) => {
      closeBottomSheet()
      fn()
    }

    return (
      <>
        <Pressable
          android_disableSound={true}
          android_ripple={{ color: '$backgroundGray' }}
          unstable_pressDelay={50}
          delayLongPress={400}
          onPress={onPress}
          onLongPress={openBottomSheet}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#a0a1b033' : 'transparent',
            borderRadius
          })}>
          {children}
        </Pressable>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          enableDynamicSizing={true}
          backgroundStyle={{
            borderRadius: 24,
            backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
          }}
          handleIndicatorStyle={{
            backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
          }}
          backdropComponent={renderBackdrop}>
          <BottomSheetView>
            <YStack width="100%" paddingTop={0} paddingBottom={30} paddingHorizontal={16} gap={10}>
              {list.map(item => (
                <TouchableOpacity onPress={() => onAndroidSelect(item.onSelect)} activeOpacity={0.7} key={item.title}>
                  <XStack
                    width="100%"
                    alignItems="center"
                    gap={10}
                    paddingHorizontal={20}
                    paddingVertical={16}
                    borderRadius={16}
                    backgroundColor="$uiCardBackground">
                    {item.androidIcon}
                    <Text color={item.color} fontSize={16}>
                      {item.title}
                    </Text>
                  </XStack>
                </TouchableOpacity>
              ))}
            </YStack>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    )
  }
}

export default ContextMenu
