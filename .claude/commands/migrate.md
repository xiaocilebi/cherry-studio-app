# 迁移到HeroUI

## 任务需求
需要将Tamagui迁移到HeroUI-native(https://github.com/heroui-inc/heroui-native)

## 任务须知
1. 内置组件存在 ./src/componentsV2中 (Text, Image, HeaderBar等)
2. icon需要在 ./src/componentsV2/icons/LucideIcon/index.tsx中注册
3. 原SettingsContainer, SettingsRow等组件更改为Container, Row
4. 组件包括图标都使用Tailwind样式替代style
5. 不确定的组件保持现状不变
6. 不确定的需要和我进行商量
7. 迁移完后需要更新migrateComponents.md并且询问我是否添加到git，git commit信息格式为: migrate(xxx): xxx

## 组件导入规范
1. 从index.ts中导入，例如 `import { YStack } from '@/componentsV2'`
