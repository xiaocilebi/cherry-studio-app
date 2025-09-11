import { ImpactFeedbackStyle } from 'expo-haptics'
import { AnimatePresence, MotiView } from 'moti'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { uuid } from '@/utils'
import { haptic } from '@/utils/haptic'

export type ToastOptions = {
  key?: string
  content?: React.ReactNode | string
  icon?: React.ReactNode | string
  color?: string
  duration?: number
  expires?: number
}

type ToastContextValue = { show: (content: React.ReactNode | string, options?: ToastOptions) => void } | undefined

const ToastContext = createContext<ToastContextValue>(undefined)

const DEFAULT_DURATION = 2000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const styles = StyleSheet.create({
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
      position: 'absolute',
      maxWidth: '80%',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 16,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#333333' : '#19191c',
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
    }
  })

  const show = (content: React.ReactNode | string, newOptions?: ToastOptions) => {
    haptic(ImpactFeedbackStyle.Medium)
    const key = uuid()
    const now = Date.now()
    const duration = newOptions?.duration ?? DEFAULT_DURATION
    const expires = now + duration
    setToasts(prev => [
      // 延长旧的 toast 的过期时间，避免新 toast 覆盖旧的 toast 导致看不见
      ...prev.map(toast => ({ ...toast, expires: (toast.expires || 0) + duration })),
      { content, ...newOptions, key, expires }
    ])
  }

  const removeExpiredToasts = () => {
    const now = Date.now()
    setToasts(prev => prev.filter(toast => toast.expires && toast.expires > now))
  }

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(removeExpiredToasts)
    if (toasts.length === 0) {
      cancelAnimationFrame(animationFrameId)
    }
    return () => cancelAnimationFrame(animationFrameId)
  }, [toasts])

  const api = { show }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View style={[StyleSheet.absoluteFill, styles.centeredView]}>
        <AnimatePresence>
          {toasts.map(toast => (
            <MotiView
              key={toast.key}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'timing', duration: 200 }}
              style={[styles.container]}>
              {toast.icon && toast.icon}

              {typeof toast?.content === 'string' ? (
                <Text color={toast.color || '$green100'} fontSize={16}>
                  {toast.content}
                </Text>
              ) : (
                toast?.content
              )}
            </MotiView>
          ))}
        </AnimatePresence>
      </View>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
