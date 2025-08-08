// src/components/menu/MenuTab.tsx (重构后)
import React, { FC } from 'react'
import { Stack, StackProps, Tabs, Text } from 'tamagui'

import { useIsDark } from '@/utils'

export type TabItem = {
  id: string
  label: string
}

interface MenuTabProps extends StackProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

export const MenuTab: FC<MenuTabProps> = ({ tabs, activeTab, onTabChange, children, ...stackProps }) => {
  const isDark = useIsDark()
  const inactiveTextColor = '$textPrimary'

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      orientation="horizontal"
      flexDirection="column"
      flex={1}
      gap={20}
      {...stackProps}>
      <Tabs.List disablePassBorderRadius borderBottomWidth={1} borderColor="$borderColor" backgroundColor="transparent">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <Tabs.Tab
              key={tab.id}
              value={tab.id}
              flex={1}
              paddingVertical={12}
              backgroundColor="transparent"
              borderBottomWidth={isActive ? 2 : 0}
              borderColor={isActive ? '$green100' : 'transparent'}
              focusStyle={{
                borderBottomWidth: isActive ? 4 : 0,
                borderColor: isActive ? '$green100' : 'transparent'
              }}>
              <Text lineHeight={17} color={isActive ? '$green100' : inactiveTextColor}>
                {tab.label}
              </Text>
            </Tabs.Tab>
          )
        })}
      </Tabs.List>

      <Stack flex={1}>{children}</Stack>
    </Tabs>
  )
}
