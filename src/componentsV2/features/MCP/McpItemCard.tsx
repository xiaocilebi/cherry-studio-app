import Text from '@/componentsV2/base/Text'
import PressableRow from '@/componentsV2/layout/PressableRow'
import YStack from '@/componentsV2/layout/YStack'
import { MCPServer } from '@/types/mcp'
import { Switch } from 'heroui-native'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface McpItemCardProps {
  mcp: MCPServer
  updateMcpServers: (mcps: MCPServer[]) => Promise<void>
  handleMcpServerItemPress: (mcp: MCPServer) => void
}

export const McpItemCard: FC<McpItemCardProps> = ({ mcp, updateMcpServers, handleMcpServerItemPress }) => {
  const { t } = useTranslation()

  const handlePress = () => {
    handleMcpServerItemPress(mcp)
  }
  const handleSwitchChange = async (value: boolean) => {
    console.log('handleSwitchChange', value)
    await updateMcpServers([{ ...mcp, isActive: value }])
  }

  return (
    <PressableRow
      onPress={handlePress}
      className="py-2.5 px-2.5 justify-between items-center rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark">
      <YStack className="h-full gap-2">
        <Text className="text-lg">{mcp.name}</Text>
        <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">{mcp.description}</Text>
      </YStack>
      <YStack className="justify-between gap-2">
        <Switch color="success" isSelected={mcp.isActive} onSelectedChange={handleSwitchChange}>
          <Switch.Thumb colors={{ defaultBackground: 'white', selectedBackground: 'white' }} />
        </Switch>

        <Text className="py-0.5 px-2 rounded-lg border-[0.5px] bg-green-10 border-green-20 text-green-100 text-sm dark:bg-green-dark-10 dark:border-green-dark-20 dark:text-green-dark-100">
          {t(`mcp.type.${mcp.type}`)}
        </Text>
      </YStack>
    </PressableRow>
  )
}
