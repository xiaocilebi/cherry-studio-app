<migrationGuide>
  <title>迁移到HeroUI</title>
  <section id="task-requirements">
    <heading>任务需求</heading>
    <requirement target="HeroUI-native" url="https://github.com/heroui-inc/heroui-native">
      需要将Tamagui迁移到HeroUI-native
    </requirement>
  </section>
  <section id="task-notes">
    <heading>任务须知</heading>
    <note index="1">内置组件存在 ./src/componentsV2 中 (Text, Image, HeaderBar 等)</note>
    <note index="2">icon 需要在 ./src/componentsV2/icons/LucideIcon/index.tsx 中注册</note>
    <note index="3">原 SettingsContainer、SettingsRow 等组件更改为 Container、Row</note>
    <note index="4">组件包括图标都使用 Tailwind 样式替代 style</note>
    <note index="5">不确定的组件保持现状不变</note>
    <note index="6">不确定的需要和我进行商量</note>
    <note index="7">迁移完后需要更新 migrateComponents.md 并且询问是否添加到 git，git commit 信息格式为 migrate(xxx): xxx</note>
  </section>
  <section id="component-catalog">
    <heading>组件列表（src/componentsV2）</heading>
    <category name="base">
      <component name="Text" path="src/componentsV2/base/Text" exports="default, TextProps" />
      <component name="Image" path="src/componentsV2/base/Image" exports="default, AnimatedImage, ImageProps" />
      <component name="TextField" path="src/componentsV2/base/TextField" exports="default, useTextFieldContext, TextFieldRootProps, TextFieldLabelProps, TextFieldInputProps, TextFieldInputStartContentProps, TextFieldInputEndContentProps, TextFieldDescriptionProps, TextFieldErrorMessageProps" />
      <component name="IconButton" path="src/componentsV2/base/IconButton" exports="IconButton" />
      <component name="ExternalLink" path="src/componentsV2/base/ExternalLink" exports="ExternalLink" />
    </category>
    <category name="layout">
      <component name="XStack" path="src/componentsV2/layout/XStack" exports="default, AnimatedXStack, XStackProps" />
      <component name="YStack" path="src/componentsV2/layout/YStack" exports="default, AnimatedYStack, YStackProps" />
      <component name="PressableRow" path="src/componentsV2/layout/PressableRow" exports="default, PressableRowProps" />
      <component name="Row" path="src/componentsV2/layout/Row" exports="default, RowProps" />
      <component name="RowRightArrow" path="src/componentsV2/layout/Row/RowRightArrow" exports="default" />
      <component name="Group" path="src/componentsV2/layout/Group" exports="default, GroupProps" />
      <component name="GroupTitle" path="src/componentsV2/layout/Group/GroupTitle" exports="default, GroupTitleProps" />
      <component name="Container" path="src/componentsV2/layout/Container" exports="default, ContainerProps" />
      <component name="SafeAreaContainer" path="src/componentsV2/layout/SafeAreaContainer" exports="default, SafeAreaContainerProps" />
    </category>
    <category name="interactive">
      <component name="HeaderBar" path="src/componentsV2/interactive/HeaderBar" exports="default, HeaderBarProps" />
      <component name="ModelGroup" path="src/componentsV2/interactive/ModelGroup" exports="default, ModelGroupProps" />
    </category>
    <category name="icons">
      <component name="LucideIcon" path="src/componentsV2/icons/LucideIcon" exports="default" />
    </category>
  </section>
  <section id="tailwind-theme">
    <heading>Tailwind 配色（tailwind.config.js）</heading>
    <file path="tailwind.config.js">
      <colors>
        <color name="brand" value="#00b96b" />
        <palette name="purple">
          <shade tone="100" value="#9c96f9" />
          <shade tone="20" value="#9c96f933" />
        </palette>
        <palette name="orange">
          <shade tone="100" value="#ffb26e" />
          <shade tone="20" value="#ffb26e33" />
          <shade tone="10" value="#ffb26e1a" />
        </palette>
        <palette name="blue">
          <shade tone="100" value="#6fb1fa" />
          <shade tone="20" value="#6fb1fa33" />
          <shade tone="10" value="#6fb1fa1a" />
        </palette>
        <palette name="pink">
          <shade tone="100" value="#e398c9" />
          <shade tone="20" value="#e398c933" />
        </palette>
        <palette name="red">
          <shade tone="100" value="#ff0000" />
          <shade tone="20" value="#ff000033" />
          <shade tone="10" value="#ff00001a" />
        </palette>
        <palette name="gray">
          <shade tone="80" value="#a0a1b0cc" />
          <shade tone="60" value="#a0a1b099" />
          <shade tone="40" value="#a0a1b066" />
          <shade tone="20" value="#a0a1b033" />
          <shade tone="10" value="#a0a1b01a" />
        </palette>
        <palette name="yellow">
          <shade tone="100" mode="light" value="#f2e218" />
          <shade tone="20" mode="light" value="#f2e21833" />
          <shade tone="dark-100" mode="dark" value="#f9ea42" />
          <shade tone="dark-20" mode="dark" value="#f9ea4233" />
        </palette>
        <palette name="green">
          <shade tone="100" mode="light" value="#81df94" />
          <shade tone="20" mode="light" value="#8de59e4d" />
          <shade tone="10" mode="light" value="#8de59e26" />
          <shade tone="dark-100" mode="dark" value="#acf3a6" />
          <shade tone="dark-20" mode="dark" value="#acf3a633" />
          <shade tone="dark-10" mode="dark" value="#acf3a61a" />
        </palette>
        <color name="text-delete" value="#dc3e42" />
        <color name="text-link" value="#0090ff" />
        <color name="border-color" value="rgba(0, 0, 0, 0.1)" />
        <semanticColor name="ui-card-background">
          <variant mode="light" value="#ffffff" />
          <variant mode="dark" value="#19191c" />
        </semanticColor>
        <semanticColor name="color-border-linear">
          <variant mode="light" value="#000000" />
          <variant mode="dark" value="#ffffff" />
        </semanticColor>
        <semanticColor name="background-primary">
          <variant mode="light" value="#f7f7f7" />
          <variant mode="dark" value="#121213" />
        </semanticColor>
        <semanticColor name="background-secondary">
          <variant mode="light" value="#ffffff99" />
          <variant mode="dark" value="#20202099" />
        </semanticColor>
        <semanticColor name="ui-card">
          <variant mode="light" value="#ffffff" />
          <variant mode="dark" value="#19191c" />
        </semanticColor>
        <semanticColor name="text-primary">
          <variant mode="light" value="#202020" />
          <variant mode="dark" value="#f9f9f9" />
        </semanticColor>
        <semanticColor name="text-secondary">
          <variant mode="light" value="#646464" />
          <variant mode="dark" value="#cecece" />
        </semanticColor>
        <semanticColor name="background-opacity">
          <variant mode="light" value="#ffffff" />
          <variant mode="dark" value="rgba(34,34,34,0.7)" />
        </semanticColor>
      </colors>
      <darkMode strategy="class" />
      <plugins>
        <plugin name="heroUINativePlugin" source="heroui-native/tailwind-plugin" />
      </plugins>
    </file>
  </section>
  <section id="import-guidelines">
    <heading>组件导入规范</heading>
    <rule index="1">从 index.ts 中导入，例如 import { YStack } from '@/componentsV2'</rule>
  </section>
</migrationGuide>
