import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { usePreventRemove } from '@react-navigation/native'
import React, { useImperativeHandle, useRef } from 'react'
import { useTheme } from 'tamagui'

import { useTheme as useCustomTheme } from '@/hooks/useTheme'

interface ISheetProps {
  bottomSheetRef?: React.RefObject<BottomSheet | null>
  isOpen: boolean
  onClose: () => void
  snapPoints: string[]
  maxDynamicContentSize?: number
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  enablePanDownToClose?: boolean
  enableDynamicSizing?: boolean
}

export function ISheet({
  bottomSheetRef,
  isOpen,
  onClose,
  snapPoints,
  maxDynamicContentSize,
  children,
  footer,
  header,
  enablePanDownToClose = true,
  enableDynamicSizing = true
}: ISheetProps) {
  const theme = useTheme()
  const { isDark } = useCustomTheme()
  const memoizedSnapPoints = snapPoints
  const ref = useRef<BottomSheet | null>(null)

  // 根据 isOpen 属性确定 BottomSheet 的 index
  // 当 isOpen 为 true 时，index 为 0 (第一个吸附点)；为 false 时，index 为 -1 (关闭状态)
  const sheetIndex = isOpen ? 0 : -1

  useImperativeHandle(bottomSheetRef, () => ref.current!)

  // 当 Sheet 打开时，阻止默认跳转，并关闭 Sheet
  usePreventRemove(isOpen, () => {
    ref.current?.close()
  })

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.8} />
  )

  const renderFooter = props => <BottomSheetFooter {...props}>{footer}</BottomSheetFooter>

  return (
    <BottomSheet
      enableDynamicSizing={enableDynamicSizing}
      maxDynamicContentSize={maxDynamicContentSize}
      ref={ref}
      index={sheetIndex}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      onClose={onClose} // 当用户通过手势关闭或调用 close() 方法时触发
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? 'rgba(18, 18, 19, 1)' : 'rgba(247, 247, 247, 1)'
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val
      }}>
      {header}
      <BottomSheetScrollView showsVerticalScrollIndicator={false} enableFooterMarginAdjustment style={{ flex: 1 }}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
