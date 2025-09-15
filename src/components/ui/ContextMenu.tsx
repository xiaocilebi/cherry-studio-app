import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import { FC, useEffect, useRef, useState } from 'react'
import React from 'react'
import { BackHandler, Pressable } from 'react-native'
import { SFSymbol } from 'sf-symbols-typescript'
import * as ZeegoContextMenu from 'zeego/context-menu'

import { useTheme } from '@/hooks/useTheme'
import { isAndroid, isIOS } from '@/utils/device'

import SelectionSheet from './SelectionSheet'

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
  const selectionSheetRef = useRef<BottomSheetModal>(null)
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      selectionSheetRef.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [isVisible])

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
      selectionSheetRef.current?.present()
    }

    const closeBottomSheet = () => {
      selectionSheetRef.current?.dismiss()
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
            opacity: pressed ? 0.9 : 1,
            borderRadius
          })}>
          {children}
        </Pressable>

        <SelectionSheet
          ref={selectionSheetRef}
          items={list.map(item => ({
            key: item.title,
            label: item.title,
            icon: item.androidIcon,
            onSelect: () => onAndroidSelect(item.onSelect)
          }))}
        />
      </>
    )
  }
}

export default ContextMenu
