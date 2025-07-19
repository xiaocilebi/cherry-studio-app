import { ArrowUpRight, CircleDollarSign, ReceiptText, UserRoundPlus } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, XStack, YStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import { Provider } from '@/types/assistant'

import { SettingGroup, SettingGroupTitle, SettingRow } from '..'
const logger = loggerService.withContext('Auth Card')

interface ServiceSectionProps {
  provider: Provider
  onLoginPress?: () => void
  onBalanceRechargePress?: () => void
  onFeeBillsPress?: () => void
}

const AuthCard: React.FC<ServiceSectionProps> = ({
  provider,
  onLoginPress,
  onBalanceRechargePress,
  onFeeBillsPress
}) => {
  const { t } = useTranslation()

  const handleLoginPress = () => {
    logger.info('Login pressed - 处理OAuth登录逻辑，类似原代码中的OAuthButton功能')
    onLoginPress?.()
  }

  const handleBalanceRechargePress = () => {
    logger.info('Balance Recharge pressed - 调用充值功能，类似原代码中的providerCharge函数')
    onBalanceRechargePress?.()
  }

  const handleFeeBillsPress = () => {
    logger.info('Fee Bills pressed - 查看账单功能，类似原代码中的providerBills函数')
    onFeeBillsPress?.()
  }

  const renderLoginItem = () => (
    <SettingGroup>
      <SettingRow>
        <XStack gap={10}>
          <UserRoundPlus size={16} />
          <Text>{t('settings.provider.auth.login')}</Text>
        </XStack>
        <ArrowUpRight size={16} />
      </SettingRow>
    </SettingGroup>
  )

  const renderLoggedInItems = () => (
    <>
      <YStack backgroundColor="$gray2" borderRadius={9}>
        <SettingRow>
          <XStack gap={10}>
            <CircleDollarSign size={16} />
            <Text>{t('settings.provider.auth.balance_recharge')}</Text>
          </XStack>
          <ArrowUpRight size={16} />
        </SettingRow>
        <SettingRow>
          <XStack gap={10}>
            <ReceiptText size={16} />
            <Text>{t('settings.provider.auth.free_bills')}</Text>
          </XStack>
          <ArrowUpRight size={16} />
        </SettingRow>
      </YStack>
    </>
  )

  return (
    <YStack gap={8}>
      <SettingGroupTitle>{t('settings.provider.auth.title', { provider: provider.name })}</SettingGroupTitle>
      <YStack>{provider.isAuthed ? renderLoggedInItems() : renderLoginItem()}</YStack>
    </YStack>
  )
}

export default AuthCard
