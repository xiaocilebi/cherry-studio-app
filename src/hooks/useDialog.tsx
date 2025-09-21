import { ImpactFeedbackStyle } from 'expo-haptics'
import { MotiView } from 'moti'
import React, { createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { haptic } from '@/utils/haptic'
import { Button, cn } from 'heroui-native'
import YStack from '@/componentsV2/layout/YStack'
import Text from '@/componentsV2/base/Text'
import XStack from '@/componentsV2/layout/XStack'

export type DialogOptions = {
  title?: React.ReactNode | string
  content?: React.ReactNode | string
  confirmText?: string
  cancelText?: string
  confirmStyle?: string
  cancelStyle?: string
  showCancel?: boolean
  /** 是否可以点击遮罩层关闭 */
  maskClosable?: boolean
  type?: 'info' | 'warning' | 'error' | 'success'
  onConFirm?: () => void
  onCancel?: () => void
}

type DialogContextValue = { open: (options: DialogOptions) => void; close: () => void } | undefined

const DialogContext = createContext<DialogContextValue>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const [isOpen, setOpen] = useState(false)
  const [options, setOptions] = useState<DialogOptions | null>(null)
  const { t } = useTranslation()

  const centeredViewClassName = isDark
    ? 'flex-1 justify-center items-center bg-black/70'
    : 'flex-1 justify-center items-center bg-black/40'

  const close = () => {
    setOpen(false)
    setTimeout(() => {
      setOptions(null)
    }, 300)
  }

  const cancel = () => {
    haptic(ImpactFeedbackStyle.Medium)
    options?.onCancel?.()
    close()
  }

  const confirm = () => {
    haptic(ImpactFeedbackStyle.Medium)
    options?.onConFirm?.()
    close()
  }

  const open = (newOptions: DialogOptions) => {
    haptic(ImpactFeedbackStyle.Medium)
    setOptions(newOptions)
    setOpen(true)
  }

  const getConfirmButtonClassName = () => {
    switch (options?.type) {
      case 'info':
        return 'bg-blue-20 dark:bg-blue-20 border-blue-20 dark:border-blue-20'
      case 'warning':
        return 'bg-orange-20 dark:bg-orange-20 border-orange-20 dark:border-orange-20'
      case 'error':
        return 'bg-red-20 dark:bg-red-20 border-red-20 dark:border-red-20'
      case 'success':
        return 'bg-green-10 dark:bg-green-dark-10 border-green-20 dark:border-green-dark-20'
      default:
        return 'bg-green-10 dark:bg-green-dark-10 border-green-20 dark:border-green-dark-20'
    }
  }

  const getConfirmTextClassName = () => {
    switch (options?.type) {
      case 'info':
        return 'text-blue-100 dark:text-blue-100'
      case 'warning':
        return 'text-orange-100 dark:text-orange-100'
      case 'error':
        return 'text-red-100 dark:text-red-100'
      case 'success':
        return 'text-green-100 dark:text-green-dark-100'
      default:
        return 'text-green-100 dark:text-green-dark-100'
    }
  }

  const api = { open, close }

  const showCancel = options?.showCancel ?? true
  const maskClosable = options?.maskClosable ?? true
  const confirmText = options?.confirmText ?? t('common.ok')
  const cancelText = options?.cancelText ?? t('common.cancel')

  const confirmButtonClassName = getConfirmButtonClassName()
  const confirmTextClassName = getConfirmTextClassName()

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Modal animationType="fade" transparent visible={isOpen} onRequestClose={cancel}>
        <MotiView
          from={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'timing', duration: 300 }}
          className={centeredViewClassName}>
          {maskClosable && <Pressable className="absolute inset-0" onPress={cancel} />}
          <YStack className="w-3/4 rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark">
            <YStack className="gap-3 p-5 items-center">
              {typeof options?.title === 'string' ? (
                <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">{options.title}</Text>
              ) : (
                options?.title
              )}
              {typeof options?.content === 'string' ? (
                <Text className="text-[15px] leading-5 text-text-secondary dark:text-text-secondary-dark text-center">
                  {options.content}
                </Text>
              ) : (
                options?.content
              )}
            </YStack>

            <XStack className="p-5 pt-0 gap-5">
              {showCancel && (
                <Button
                  variant="tertiary"
                  className={cn(
                    'flex-1 h-[42px] rounded-[30px] bg-transparent border-gray-20 dark:border-gray-20',
                    options?.cancelStyle?.toString() || ''
                  )}
                  onPress={cancel}>
                  <Button.LabelContent>
                    <Text className="text-gray-80 dark:text-gray-80 text-[17px]">{cancelText}</Text>
                  </Button.LabelContent>
                </Button>
              )}
              <Button
                className={cn(
                  'flex-1 h-[42px] rounded-[30px] border',
                  confirmButtonClassName,
                  options?.confirmStyle?.toString() || ''
                )}
                onPress={confirm}>
                <Button.LabelContent>
                  <Text className={cn(confirmTextClassName, 'text-[17px]')}>{confirmText}</Text>
                </Button.LabelContent>
              </Button>
            </XStack>
          </YStack>
        </MotiView>
      </Modal>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider')
  return ctx
}
