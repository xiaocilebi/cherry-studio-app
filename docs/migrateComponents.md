# Tamagui 到 HeroUI 组件迁移计划

## 迁移须知

1. 新迁移的组件统一放在 `src/componentsV2/` 目录，并提供默认样式；扩展样式前先查阅现有实现。
2. 将 Tamagui 组件改写为 HeroUI (`heroui-native`) 或项目自建的 HeroUI 包装组件；删除残留的 `tamagui` / `@tamagui/*` 引用。
3. 新增图标需在 `src/componentsV2/icons/LucideIcon/index.tsx` 中注册并复用既有 `IconProps` 类型。

## 迁移概述

- **数据更新时间**: 2025-09-18
- **HeroUI 组件库**: `src/componentsV2/` 共 34 个 `.tsx` 文件，均已完成迁移并通过 `index.ts` 聚合导出。
- **旧组件目录**: `src/components/` 共 74 个 `.tsx` 文件，目前 15 个已移除 Tamagui，59 个仍依赖 Tamagui。
- **页面**: `src/screens/` 共 57 个 `.tsx`，55 个已脱离 Tamagui，剩余 2 个待迁移。
- **其他核心入口**: 5 个基础文件仍直接引用 Tamagui (`App.tsx`, `constants/Colors.ts`, `hooks/useDialog.tsx`, `hooks/useToast.tsx`, `navigators/AssistantDetailTabNavigator.tsx`)。
- **总体 Tamagui 引用**: 66 / 170 跟踪文件 → 已完成 104 (61.2%)。

## 迁移进度

### ✅ HeroUI 组件 (`src/componentsV2/`, 34/34)

**Base**
- [x] `base/ExternalLink/index.tsx`
- [x] `base/IconButton/index.tsx`
- [x] `base/Image/index.tsx`
- [x] `base/Text/index.tsx`
- [x] `base/TextField/index.tsx`

**Layout**
- [x] `layout/Container/index.tsx`
- [x] `layout/Group/index.tsx`
- [x] `layout/Group/GroupTitle.tsx`
- [x] `layout/PressableRow/index.tsx`
- [x] `layout/Row/index.tsx`
- [x] `layout/Row/RowRightArrow.tsx`
- [x] `layout/SafeAreaContainer/index.tsx`
- [x] `layout/XStack/index.tsx`
- [x] `layout/YStack/index.tsx`

**Features**
- [x] `features/HeaderBar/index.tsx`
- [x] `features/ModelGroup/index.tsx`
- [x] `features/TopicItem/index.tsx`
- [x] `features/TopicList/index.tsx`

**Icons**
- [x] `icons/ArrowIcon/index.tsx`
- [x] `icons/AssetsIcon/index.tsx`
- [x] `icons/DefaultProviderIcon/index.tsx`
- [x] `icons/EditIcon/index.tsx`
- [x] `icons/FallbackFavicon/index.tsx`
- [x] `icons/FileIcon/index.tsx`
- [x] `icons/LucideIcon/index.tsx`
- [x] `icons/MarketIcon/index.tsx`
- [x] `icons/MdiLightbulbIcon/index.tsx`
- [x] `icons/ModelChangeIcon/index.tsx`
- [x] `icons/MultiModelIcon/index.tsx`
- [x] `icons/TranslationIcon/index.tsx`
- [x] `icons/UnionIcon/index.tsx`
- [x] `icons/UnionPlusIcon/index.tsx`
- [x] `icons/UserChangeIcon/index.tsx`
- [x] `icons/VoiceIcon/index.tsx`

**Barrel**
- [x] `index.ts`

### 🔄 待迁移组件

#### 高优先级 - 核心 UI (`src/components/ui/`, 14/18 待迁移)
- [ ] `AvatarEditButton.tsx`
- [ ] `CustomButton.tsx`
- [ ] `CustomTag.tsx`
- [ ] `DatabackupIcon.tsx`
- [ ] `ImageSkeleton.tsx`
- [ ] `MarqueeComponent.tsx`
- [ ] `ModelTags.tsx`
- [ ] `SafeAreaContainer.tsx`
- [ ] `Searching.tsx`
- [ ] `SearchInput.tsx`
- [ ] `Select.tsx`
- [ ] `SelectionSheet.tsx`
- [ ] `Switch.tsx`
- [ ] `WebsearchIcon.tsx`
- [x] `ContextMenu.tsx`
- [x] `DrawerGestureWrapper.tsx`
- [x] `ModelIcon.tsx`
- [x] `ProviderIcon.tsx`

#### 顶部导航栏组件 (`src/components/header-bar/`, 4/4 待迁移)
- [ ] `AssistantSelection.tsx`
- [ ] `index.tsx`
- [ ] `MenuButton.tsx`
- [ ] `NewTopicButton.tsx`

#### 消息输入组件 (`src/components/message-input/`, 10/12 待迁移)
- [ ] `FilePreview.tsx`
- [ ] `MentionButton.tsx`
- [ ] `MessageInput.tsx`
- [ ] `PauseButton.tsx`
- [ ] `SendButton.tsx`
- [ ] `ToolPreview.tsx`
- [ ] `VoiceButton.tsx`
- [ ] `preview-items/FileItem.tsx`
- [ ] `preview-items/ImageItem.tsx`
- [ ] `preview-items/PreviewItem.tsx`
- [x] `ThinkButton.tsx`
- [x] `ToolButton.tsx`

### 中等优先级 - 功能组件

#### 助手相关 (`src/components/assistant/`, 7/9 待迁移)
- [ ] `AssistantItem.tsx`
- [ ] `AssistantItemCard.tsx`
- [ ] `AssistantItemSkeleton.tsx`
- [x] `EmojiAvator.tsx`
- [ ] `market/AssistantItemSheet.tsx`
- [ ] `market/AssistantMarketLoading.tsx`
- [ ] `market/AssistantsTabContent.tsx`
- [ ] `market/GroupTag.tsx`
- [x] `ModelTabContent.tsx`

#### 设置 - Data (`src/components/settings/data/`, 4/4 待迁移)
- [ ] `Notion.tsx`
- [ ] `RestoreProgressModal.tsx`
- [ ] `WebDav.tsx`
- [ ] `Yuque.tsx`

#### 设置 - Providers (`src/components/settings/providers/`, 6/8 待迁移)
- [ ] `AddModelSheet.tsx`
- [ ] `AddProviderSheet.tsx`
- [ ] `ApiCheckSheet.tsx`
- [ ] `EmptyModelView.tsx`
- [ ] `ProviderIconButton.tsx`
- [ ] `ProviderItem.tsx`
- [x] `ModelSelect.tsx`（依赖 `ui/Select`，待基础组件迁移后回归验证）
- [x] `ProviderSelect.tsx`（依赖 `ui/Select`，待基础组件迁移后回归验证）

#### 设置 - Websearch (`src/components/settings/websearch/`, 1/3 待迁移)
- [ ] `ApiCheckSheet.tsx`
- [x] `WebsearchProviderRow.tsx`
- [x] `WebsearchSelect.tsx`（依赖 `ui/Select`，待基础组件迁移后回归验证）

#### 弹窗与模态 (`src/components/sheets/`, 10/11 待迁移)
- [ ] `BottomSheetSearchInput.tsx`
- [ ] `CitationSheet.tsx`
- [ ] `ModelSheet.tsx`
- [ ] `ReasoningSheet.tsx`
- [ ] `TextSelectionSheet.tsx`
- [ ] `ToolSheet/CameraModal.tsx`
- [ ] `ToolSheet/ExternalTools.tsx`
- [ ] `ToolSheet/SystemTools.tsx`
- [ ] `ToolSheet/ToolSheet.tsx`
- [ ] `ToolUseSheet.tsx`
- [x] `WebsearchSheet.tsx`

#### 菜单与话题 (`src/components/menu/`, 3/3 待迁移)
- [ ] `CustomDrawerContent.tsx`
- [ ] `MenuTab.tsx`
- [ ] `MenuTabContent.tsx`

### 页面组件 (`src/screens/`, 2/57 待迁移)
- [ ] `home/messages/MultiModelTab.tsx`
- [ ] `settings/providers/ManageModelsScreen.tsx`
- 其余 55 个页面文件已移除 Tamagui 依赖，无需迁移。

### 其他 Tamagui 入口 (0/5 已迁移)
- [ ] `src/App.tsx`
- [ ] `src/constants/Colors.ts`
- [ ] `src/hooks/useDialog.tsx`
- [ ] `src/hooks/useToast.tsx`
- [ ] `src/navigators/AssistantDetailTabNavigator.tsx`

### 间接依赖（等待基础组件迁移）
这些文件本身未直接引用 Tamagui，但依赖尚未迁移的 Tamagui 组件，后续需回访：
- `src/components/settings/providers/ModelSelect.tsx`（依赖 `ui/Select`）
- `src/components/settings/providers/ProviderSelect.tsx`（依赖 `ui/Select`）
- `src/components/settings/websearch/WebsearchSelect.tsx`（依赖 `ui/Select`）
- `src/components/sheets/WebsearchSheet.tsx`（依赖 `ui/SelectionSheet`）

## 迁移指南

### 推荐迁移顺序

1. **核心 UI 组件** (`src/components/ui/`)：优先处理基础控件，避免重复适配。
2. **顶部导航栏**：直接影响全局导航体验。
3. **消息输入链路**：保障主聊天流程可用。
4. **功能模块组件**：逐步替换助手、设置、弹窗等场景。
5. **页面与基础入口**：收尾阶段统一替换残留的 Tabs、主题与辅助逻辑。

### 常见迁移模式

1. 将 `tamagui` 导入替换为 HeroUI 或 `componentsV2` 中的封装组件。
2. 调整属性以对齐 HeroUI API，必要时使用 Tailwind className 覆盖样式。
3. 将 Tamagui token 映射到项目配色方案 (`text-*`, `bg-*`, `border-*`)。
4. 替换交互组件（如 `Tabs`, `Switch`, `Select`）时，同步迁移依赖的上下文与逻辑。
5. 迁移完成后回归测试相关页面，确认主题切换与交互反馈正常。

### 测试策略

- 为新增的 HeroUI 组件增加 Storybook / 单元测试或最小使用示例。
- 手动验证受影响页面的亮暗模式、不同屏幕尺寸与可访问性表现。
- 对表单组件执行输入校验、焦点控制、滚动行为检查。
- 聊天相关组件需验证键盘交互、长列表性能与动画效果。

## 进度追踪

- **总体进度**: 104 / 170 (61.2%) — 已脱离 Tamagui 的文件 / 跟踪总文件
- **旧组件目录 (`src/components`)**: 15 / 74 (20.3%)
- **页面 (`src/screens`)**: 55 / 57 (96.5%)
- **其他核心入口**: 0 / 5 (0%)
- **HeroUI 组件库**: 34 / 34 (100%)
