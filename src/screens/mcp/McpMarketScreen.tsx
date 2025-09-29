import { Container, DrawerGestureWrapper, HeaderBar, SafeAreaContainer, SearchInput } from '@/componentsV2'
import { Menu } from '@/componentsV2/icons'
import { haptic } from '@/utils/haptic'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { DrawerNavigationProps } from '@/types/naviagate'
import { useMcpServers } from '@/hooks/useMcp'
import { useSearch } from '@/hooks/useSearch'
import { MCPServer } from '@/types/mcp'
import { McpMarketContent } from '@/componentsV2/features/MCP/McpMarketContent'

export function McpMarketScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()
  const { mcpServers, isLoading, updateMcpServers } = useMcpServers()

  const {
    searchText,
    setSearchText,
    filteredItems: filteredMcps
  } = useSearch(
    mcpServers,
    useCallback((mcp: MCPServer) => [mcp.name || '', mcp.id || ''], [])
  )

  const handleMenuPress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigation.dispatch(DrawerActions.openDrawer())
  }
  if (isLoading) {
    return null
  }
  return (
    <SafeAreaContainer className="pb-0">
      <DrawerGestureWrapper>
        <View collapsable={false} className="flex-1">
          <HeaderBar
            title={t('mcp.market.title')}
            leftButton={{
              icon: <Menu size={24} />,
              onPress: handleMenuPress
            }}
          />
          <Container className="py-0 gap-2.5">
            <SearchInput
              placeholder={t('assistants.market.search_placeholder')}
              value={searchText}
              onChangeText={setSearchText}
            />
            <McpMarketContent mcps={filteredMcps} updateMcps={updateMcpServers} />
          </Container>
        </View>
      </DrawerGestureWrapper>
    </SafeAreaContainer>
  )
}
