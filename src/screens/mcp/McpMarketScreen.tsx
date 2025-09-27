import { DrawerGestureWrapper, HeaderBar, SafeAreaContainer, Text } from "@/componentsV2";
import { Menu } from "@/componentsV2/icons";
import { haptic } from "@/utils/haptic";
import { ImpactFeedbackStyle } from "expo-haptics";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { DrawerNavigationProps } from "@/types/naviagate";

export function McpMarketScreen() {
  const {t} = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()
  const handleMenuPress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigation.dispatch(DrawerActions.openDrawer())
  }
  return (
    <SafeAreaContainer className="pb-0">
    <DrawerGestureWrapper>
      <View collapsable={false} className="flex-1">
        <HeaderBar
          title={t('assistants.title.mine')}
          leftButton={{
            icon: <Menu size={24} />,
            onPress: handleMenuPress
          }}
        />
        <Text>MCP Market Screen</Text>
      </View>
    </DrawerGestureWrapper>
    </SafeAreaContainer>
  );
}
