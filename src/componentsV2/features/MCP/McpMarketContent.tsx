import YStack from "@/componentsV2/layout/YStack";
import { MCPServer } from "@/types/mcp";
import { LegendList } from "@legendapp/list";
import React, { FC, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { McpItemCard } from "./McpItemCard";

interface McpMarketContentProps {
  mcps: MCPServer[];
  updateMcps: (mcps: MCPServer[]) => Promise<void>;
}

export const McpMarketContent: FC<McpMarketContentProps> = ({ mcps ,updateMcps}) => {
  const insets = useSafeAreaInsets()

  const renderItem = useCallback(
    ({ item }: { item: MCPServer }) => <McpItemCard mcp={item} updateMcps={updateMcps} />,
    [updateMcps]
  )
  return (
    <YStack className="flex-1">
      <LegendList
        data={mcps}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={()=><YStack className="h-2"/>}
        recycleItems
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </YStack>
  );
};
