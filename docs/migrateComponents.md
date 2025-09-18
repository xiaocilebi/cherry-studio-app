# Tamagui 到 HeroUI 组件迁移计划

## 迁移须知
1. 所有新的迁移组件均为与 ./src/componentsV2/ 目录下。组件中具有默认的样式，添加样式时需要查看组件中的样式
2. 需要将tamagui改为使用heroui-native
3. 新添加的icon需要在LucideIcon/index.tsx中注册


## 迁移概述

本文档用于追踪 Cherry Studio React Native 应用从 Tamagui 到 HeroUI 组件的迁移进度。

- **分析文件总数**: 178
- **需要迁移的文件**: 81 (70 组件 + 11 页面仍使用 Tamagui)
- **已迁移文件**: 18 (`src/componentsV2/`)
- **无需迁移文件**: 77 (31 组件 + 46 页面已无 Tamagui)

## 迁移进度

### ✅ 已完成迁移的组件 (18/18)

位于 `src/componentsV2/`:

- [x] `base/ExternalLink/index.tsx`
- [x] `base/IconButton/index.tsx`
- [x] `base/Image/index.tsx`
- [x] `base/Text/index.tsx`
- [x] `base/TextField/index.tsx`
- [x] `icons/LucideIcon/index.tsx`
- [x] `interactive/HeaderBar/index.tsx`
- [x] `interactive/ModelGroup/index.tsx`
- [x] `layout/Container/index.tsx`
- [x] `layout/Group/index.tsx`
- [x] `layout/PressableRow/index.tsx`
- [x] `layout/Group/GroupTitle.tsx`
- [x] `layout/Row/index.tsx`
- [x] `layout/Row/RowRightArrow.tsx`
- [x] `layout/SafeAreaContainer/index.tsx`
- [x] `layout/XStack/index.tsx`
- [x] `layout/YStack/index.tsx`
- [x] `index.ts`


## 🔄 待迁移组件

### 高优先级 - 核心UI组件 (30 项，其中 29 项待迁移)

#### `src/components/ui/` (15 个组件)
- [ ] `AvatarEditButton.tsx`
- [ ] `CustomButton.tsx`
- [ ] `CustomSlider.tsx`
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

#### 顶部导航栏组件 (4 个组件)
- [ ] `header-bar/AssistantSelection.tsx`
- [ ] `header-bar/index.tsx`
- [ ] `header-bar/MenuButton.tsx`
- [ ] `header-bar/NewTopicButton.tsx`

#### 消息输入组件 (10 个组件)
- [ ] `message-input/FilePreview.tsx`
- [ ] `message-input/MentionButton.tsx`
- [ ] `message-input/MessageInput.tsx`
- [ ] `message-input/PauseButton.tsx`
- [ ] `message-input/SendButton.tsx`
- [ ] `message-input/ToolPreview.tsx`
- [ ] `message-input/VoiceButton.tsx`
- [ ] `message-input/preview-items/FileItem.tsx`
- [ ] `message-input/preview-items/ImageItem.tsx`
- [ ] `message-input/preview-items/PreviewItem.tsx`

#### 其他核心组件 (1 个组件，已完成)
- [x] `ExternalLink.tsx` (已迁移至 `componentsV2/base/ExternalLink`)

### 中等优先级 - 功能组件 (43 项，其中 40 个待迁移)

#### 助手相关组件 (11 个组件)
- [ ] `assistant/AssistantItem.tsx`
- [ ] `assistant/AssistantItemCard.tsx`
- [ ] `assistant/AssistantItemSkeleton.tsx`
- [ ] `assistant/EmojiAvator.tsx`
- [ ] `assistant/ModelTabContent.tsx`
- [ ] `assistant/PromptTabContent.tsx`
- [ ] `assistant/ToolTabContent.tsx`
- [ ] `assistant/market/AssistantItemSheet.tsx`
- [ ] `assistant/market/AssistantMarketLoading.tsx`
- [ ] `assistant/market/AssistantsTabContent.tsx`
- [ ] `assistant/market/GroupTag.tsx`

#### 设置相关组件 (17 个组件，其中 1 个已完成)
- [ ] `settings/HeaderBar.tsx`
- [ ] `settings/index.tsx`
- [ ] `settings/Providers.tsx`
- [ ] `settings/data/Notion.tsx`
- [ ] `settings/data/RestoreProgressModal.tsx`
- [ ] `settings/data/WebDav.tsx`
- [ ] `settings/data/Yuque.tsx`
- [ ] `settings/providers/AddModelSheet.tsx`
- [ ] `settings/providers/AddProviderSheet.tsx`
- [ ] `settings/providers/ApiCheckSheet.tsx`
- [ ] `settings/providers/AuthCard.tsx`
- [ ] `settings/providers/EmptyModelView.tsx`
- [ ] `settings/providers/ProviderIconButton.tsx`
- [ ] `settings/providers/ProviderItem.tsx`
- [ ] `settings/websearch/ApiCheckSheet.tsx`
- [ ] `settings/websearch/WebsearchProviderRow.tsx`
- [x] `settings/providers/ModelGroup.tsx` (已迁移至 `componentsV2/interactive/ModelGroup`)

#### 弹窗和模态框组件 (11 个组件)
- [ ] `sheets/BottomSheetSearchInput.tsx`
- [ ] `sheets/CitationSheet.tsx`
- [ ] `sheets/ModelSheet.tsx`
- [ ] `sheets/ReasoningSheet.tsx`
- [ ] `sheets/TextSelectionSheet.tsx`
- [ ] `sheets/ToolSheet/CameraModal.tsx`
- [ ] `sheets/ToolSheet/ExternalTools.tsx`
- [ ] `sheets/ToolSheet/SystemTools.tsx`
- [ ] `sheets/ToolSheet/ToolSheet.tsx`
- [ ] `sheets/ToolUseSheet.tsx`
- [ ] `sheets/WebsearchSheet.tsx`

#### 菜单和话题组件 (3 个组件，其中 2 个已完成)
- [ ] `menu/CustomDrawerContent.tsx`
- [ ] `menu/MenuTab.tsx`
- [ ] `menu/MenuTabContent.tsx`
- [x] `topic/GroupTopicList.tsx`
- [x] `topic/TopicItem.tsx`

### 页面组件 (0 待迁移 / 39)

#### 高优先级核心页面 (5 个页面)
- [x] `WelcomeScreen.tsx`
- [x] `home/ChatScreen.tsx`
- [x] `topic/TopicScreen.tsx`
- [x] `assistant/AssistantScreen.tsx`
- [x] `settings/SettingsScreen.tsx`

#### 聊天和首页相关页面 (18 个页面，全部已迁移)
- [x] `home/WelcomeContent.tsx`
- [x] `home/markdown/ReactNativeMarkdown.tsx`
- [x] `home/markdown/useMarkedRenderer.tsx`
- [x] `home/messages/CitationList.tsx`
- [x] `home/messages/MessageContent.tsx`
- [x] `home/messages/MessageContextMenu.tsx`
- [x] `home/messages/MessageFooter.tsx`
- [x] `home/messages/MessageGroup.tsx`
- [x] `home/messages/MessageHeader.tsx`
- [x] `home/messages/Messages.tsx`
- [x] `home/messages/MultiModelTab.tsx`
- [x] `home/messages/blocks/ErrorBlock.tsx`
- [x] `home/messages/blocks/MainTextBlock.tsx`
- [x] `home/messages/blocks/PlaceholderBlock.tsx`
- [x] `home/messages/blocks/ThinkingBlock.tsx`
- [x] `home/messages/blocks/TranslationBlock.tsx`
- [x] `home/messages/blocks/index.tsx`
- [x] `home/messages/tools/MessageWebSearchTool.tsx`

#### 助手相关页面 (5 个页面，全部已迁移)
- [x] `assistant/AssistantDetailScreen.tsx`
- [x] `assistant/AssistantMarketScreen.tsx`
- [x] `assistant/tabs/ModelTabScreen.tsx`
- [x] `assistant/tabs/PromptTabScreen.tsx`
- [x] `assistant/tabs/ToolTabScreen.tsx`

#### 设置相关页面 (16 个页面，全部已迁移)
- [x] `settings/assistant/AssistantSettingsScreen.tsx`
- [x] `settings/data/BasicDataSettingsScreen.tsx`
- [x] `settings/data/DataSettingsScreen.tsx`
- [x] `settings/data/Landrop/QRCodeScanner.tsx`
- [x] `settings/general/GeneralSettingsScreen.tsx`
- [x] `settings/general/LanguageChangeScreen.tsx`
- [x] `settings/general/ThemeSettingsScreen.tsx`
- [x] `settings/personal/PersonalScreen.tsx`
- [x] `settings/providers/ApiServiceScreen.tsx`
- [x] `settings/providers/ManageModelsScreen.tsx`
- [x] `settings/providers/ProviderListScreen.tsx`
- [x] `settings/providers/ProviderSettingsScreen.tsx`
- [x] `settings/websearch/GeneralSettings.tsx`
- [x] `settings/websearch/ProviderSettings.tsx`
- [x] `settings/websearch/WebSearchProviderSettingsScreen.tsx`
- [x] `settings/websearch/WebSearchSettingsScreen.tsx`


## ✨ 无需迁移的组件 (共 44 项)

这些组件不使用 Tamagui 或已经迁移完成:

### 图标组件 (16 个组件)
- [x] `icons/ArrowIcon.tsx`
- [x] `icons/AssetsIcon.tsx`
- [x] `icons/DefaultProviderIcon.tsx`
- [x] `icons/EditIcon.tsx`
- [x] `icons/FallbackFavicon.tsx`
- [x] `icons/FileIcon.tsx`
- [x] `icons/index.tsx`
- [x] `icons/MarketIcon.tsx`
- [x] `icons/MdiLightbulbIcon.tsx`
- [x] `icons/ModelChangeIcon.tsx`
- [x] `icons/MultiModelIcon.tsx`
- [x] `icons/TranslationIcon.tsx`
- [x] `icons/UnionIcon.tsx`
- [x] `icons/UnionPlusIcon.tsx`
- [x] `icons/UserChangeIcon.tsx`
- [x] `icons/VoiceIcon.tsx`

### 其他组件 (15 个组件)
- [x] `message-input/ThinkButton.tsx`
- [x] `message-input/ToolButton.tsx`
- [x] `settings/data/index.tsx`
- [x] `settings/providers/ModelSelect.tsx`
- [x] `settings/providers/ProviderSelect.tsx`
- [x] `settings/websearch/WebsearchSelect.tsx`
- [x] `sheets/ToolSheet.tsx`
- [x] `sheets/ToolSheet/index.ts`
- [x] `sheets/ToolSheet/useAIFeatureHandler.ts`
- [x] `sheets/ToolSheet/useCameraHandler.ts`
- [x] `sheets/ToolSheet/useFileHandler.ts`
- [x] `ui/ContextMenu.tsx`
- [x] `ui/DrawerGestureWrapper.tsx`
- [x] `ui/ModelIcon.tsx`
- [x] `ui/ProviderIcon.tsx`

### 不使用 Tamagui 的页面组件 (13 个页面)
- [x] `home/ChatContent.tsx`
- [x] `home/markdown/MarkdownStyles.tsx`
- [x] `home/markdown/useMathEquation.tsx`
- [x] `home/messages/Message.tsx`
- [x] `home/messages/blocks/CitationBlock.tsx`
- [x] `home/messages/blocks/FileBlock.tsx`
- [x] `home/messages/blocks/ImageBlock.tsx`
- [x] `home/messages/blocks/ToolBlock.tsx`
- [x] `home/messages/tools/MessageTool.tsx`
- [x] `home/messages/tools/MessageTools.tsx`
- [x] `settings/about/AboutScreen.tsx`
- [x] `settings/data/Landrop/LandropSettingsScreen.tsx`
- [x] `settings/data/Landrop/Overlay.tsx`

## 最新组件提取

### ModelGroup 组件 (2025-09-17)

**提取位置**: `src/componentsV2/interactive/ModelGroup/index.tsx`

**功能描述**:
- 统一的模型分组展示组件，使用 Accordion 布局
- 支持自定义模型项渲染和组按钮渲染
- 完全响应式设计，支持亮/暗主题
- 内置空状态处理和国际化支持

**影响的文件**:
- `src/screens/settings/providers/ManageModelsScreen.tsx` - 使用完整功能版本
- `src/screens/settings/providers/ProviderSettingsScreen.tsx` - 使用简化版本
- `src/componentsV2/index.ts` - 新增导出

**代码优化效果**:
- 减少重复代码 ~90 行
- 统一组件行为和样式
- 提高可维护性和复用性
- 修复 React key props 警告

## 迁移指南

### 推荐迁移顺序

1. **从核心UI组件开始** (`src/components/ui/`)
2. **迁移顶部导航栏组件** (影响导航功能)
3. **迁移消息输入组件** (核心聊天功能)
4. **转向功能组件** (助手、设置、弹窗)
5. **最后完成页面组件**

### 常见迁移模式

从 Tamagui 迁移到 HeroUI 时:

1. 将 Tamagui 导入替换为 HeroUI 等价组件
2. 更新组件属性以匹配 HeroUI API
3. 从 Tamagui 的 token 系统调整为 HeroUI 的样式方案
4. 迁移后测试组件功能
5. 更新引用已迁移组件的依赖组件

### 测试策略

- 独立测试每个迁移的组件
- 验证组件在父页面中仍能正常工作
- 检查不同屏幕尺寸下的响应式行为
- 确保保持无障碍功能

## 进度追踪

- **总体进度**: 108/178 (60.7%)
- **组件**: 36/105 (34.3%)
- **页面**: 56/57 (98.2%)
- **已完成**: 18/18 (100%)

### WelcomeScreen 组件 (2025-09-18)

**迁移位置**: `src/screens/WelcomeScreen.tsx`

**功能描述**:
- 应用启动欢迎页面，包含轮播介绍和开始按钮
- 支持自动轮播和手动切换的功能介绍页面
- 完全响应式设计，支持中文内容展示

**迁移变更**:
- 将 Tamagui 的 `Button, Text, View, XStack, YStack` 替换为 HeroUI 组件
- `Button` 从 'tamagui' → 'heroui-native' 并使用 Tailwind 样式
- `Text, XStack, YStack, Image, SafeAreaContainer` 从 'tamagui' → '@/componentsV2'
- 所有样式属性转换为 Tailwind classes
- 修复 ESLint 警告（转义引号字符）

**样式转换示例**:
- `fontSize={24}` → `className="text-2xl"`
- `backgroundColor="#9333EA"` → `className="bg-purple-600"`
- `paddingVertical={20}` → `className="py-5"`
- `alignItems="center"` → `className="items-center"`

**代码优化效果**:
- 完全迁移到新的组件系统
- 保持原有功能和视觉效果
- 统一使用 Tailwind 样式规范
- 符合项目 ESLint 规则

### TopicItem & GroupTopicList 组件 (2025-09-18)

**迁移位置**:
- `src/components/topic/TopicItem.tsx`
- `src/components/topic/GroupTopicList.tsx`

**功能描述**:
- TopicItem: 话题列表项组件，支持重命名、删除、生成话题名称等操作
- GroupTopicList: 话题分组列表组件，按时间分组展示话题

**迁移变更**:

**TopicItem.tsx**:
- 替换 `@tamagui/lucide-icons` → `@/componentsV2/icons/LucideIcon` (Edit3, Sparkles, Trash2)
- 将 `Text, View, XStack, YStack, Input` from 'tamagui' → HeroUI 组件
- `Input` → `TextField` 组件结构 (TextField.Input)
- 所有样式属性转换为 Tailwind classes
- 图标 color 属性转换为 className

**GroupTopicList.tsx**:
- 将 `Text, YStack` from 'tamagui' → `@/componentsV2`
- Text 组件样式转换为 Tailwind classes
- ItemSeparatorComponent 使用 Tailwind 高度类

**样式转换示例**:
- `color="$textPrimary"` → `className="text-text-primary dark:text-text-primary-dark"`
- `fontWeight="bold"` → `className="font-bold"`
- `height={10}` → `className="h-2.5"`
- `backgroundColor={isActive ? '$green10' : 'transparent'}` → 条件 className

**代码优化效果**:
- 完全迁移到 HeroUI-native 组件系统
- 统一使用 Tailwind 样式规范
- 保持所有原有功能和交互效果
- 图标系统统一使用 LucideIcon

最后更新: 2025-09-18
Git 信息: migrate(TopicComponents): migrate TopicItem and GroupTopicList to HeroUI-native
