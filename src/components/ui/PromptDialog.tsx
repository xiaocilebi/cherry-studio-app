import { Button, Input, Text, XStack, YStack } from 'tamagui'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import React from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet } from 'react-native'
import { useTheme, View } from 'tamagui'

type PromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  initialValue?: string
  onSave: (value: string) => void
}

export function PromptDialog({ open, onOpenChange, title, description, initialValue = '', onSave }: PromptDialogProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(initialValue)
  const theme = useTheme()

  useEffect(() => {
    if (open) {
      setValue(initialValue)
    }
  }, [initialValue, open])

  const handleSave = () => {
    onSave(value)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)'
    }
  })

  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={handleCancel}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centeredView}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
        <YStack width="75%" borderRadius={20} backgroundColor="$uiCardBackground">
          <YStack gap={16} padding={20} alignItems="center">
            <Text fontSize={18} fontWeight="bold" color="$textPrimary">
              {title}
            </Text>
            {description && (
              <Text fontSize={14} color="$textSecondary">
                {description}
              </Text>
            )}
            <Input
              value={value}
              onChangeText={setValue}
              placeholder={t('common.please_enter') || ''}
              autoFocus
              width="100%"
            />
          </YStack>

          <XStack padding={20} paddingTop={0} gap={20}>
            <Button
              flex={1}
              size={42}
              borderRadius={30}
              fontSize={17}
              backgroundColor="$gray20"
              borderColor="$gray20"
              color="$gray80"
              onPress={handleSave}>
              {t('common.cancel')}
            </Button>
            <Button
              flex={1}
              size={42}
              borderRadius={30}
              fontSize={17}
              backgroundColor="$green10"
              borderColor="$green20"
              color="$green100"
              onPress={handleSave}>
              {t('common.save')}
            </Button>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </Modal>
  )
}
