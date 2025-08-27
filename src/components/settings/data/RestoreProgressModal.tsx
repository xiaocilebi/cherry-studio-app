import { CircleCheck, TriangleAlert, XCircle } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Paragraph, Spinner, Text, Unspaced, XStack, YStack } from 'tamagui'

import { RestoreStepId, StepStatus } from '@/services/BackupService'

export interface RestoreStep {
  id: RestoreStepId
  title: string
  status: StepStatus
  error?: string
}

interface RestoreProgressModalProps {
  isOpen: boolean
  steps: RestoreStep[]
  overallStatus: 'running' | 'success' | 'error'
  onClose: () => void
}

const getIconForStatus = (status: StepStatus) => {
  switch (status) {
    case 'in_progress':
      return <Spinner size="small" color="$textLink" />
    case 'completed':
      return <CircleCheck size={20} color="$green100" />
    case 'error':
      return <XCircle size={20} color="$red100" />
    case 'pending':
    default:
      return <TriangleAlert size={20} color="$orange100" />
  }
}

const getBackgroundColor = (status: StepStatus) => {
  switch (status) {
    case 'in_progress':
      return '$yellow20'
    case 'completed':
      return '$green10'
    case 'error':
      return '$red20'
    case 'pending':
    default:
      return '$orange20'
  }
}

const getFontColor = (status: StepStatus) => {
  switch (status) {
    case 'in_progress':
      return '$yellow100'
    case 'completed':
      return '$green100'
    case 'error':
      return '$red'
    case 'pending':
    default:
      return '$orange100'
  }
}

export function RestoreProgressModal({ isOpen, steps, overallStatus, onClose }: RestoreProgressModalProps) {
  const { t } = useTranslation()
  const isDone = overallStatus === 'success' || overallStatus === 'error'
  const title =
    overallStatus === 'success'
      ? t('settings.data.restore.progress.success')
      : overallStatus === 'error'
        ? t('settings.data.restore.progress.error')
        : t('settings.data.restore.progress.pending')

  const description =
    overallStatus === 'success'
      ? t('settings.data.restore.progress.success_description')
      : overallStatus === 'error'
        ? t('settings.data.restore.progress.error_description')
        : t('settings.data.restore.progress.pending_description')

  return (
    <Dialog modal open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation="quick"
          w="90%"
          enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ y: -20, opacity: 0, scale: 0.9 }}
          gap="$4">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>

          <YStack gap="$3" paddingVertical="$2">
            {steps.map(step => (
              <XStack
                key={step.id}
                alignItems="center"
                gap={13}
                paddingVertical={12}
                paddingLeft={12}
                paddingRight={15}
                borderRadius={17}
                backgroundColor={getBackgroundColor(step.status)}>
                {getIconForStatus(step.status)}
                <Paragraph flex={1} color={getFontColor(step.status)}>
                  {step.title}
                </Paragraph>
              </XStack>
            ))}
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                onPress={onClose}
                disabled={!isDone}
                backgroundColor={
                  overallStatus === 'error' ? '$red20' : overallStatus === 'success' ? '$green20' : '$yellow20'
                }>
                <Text
                  color={
                    overallStatus === 'error' ? '$red100' : overallStatus === 'success' ? '$green100' : '$yellow100'
                  }>
                  {isDone ? t('common.close') : t('settings.data.restore.progress.pending')}
                </Text>
              </Button>
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
