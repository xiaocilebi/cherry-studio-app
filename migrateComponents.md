# Component Migration Log

This file tracks the migration of components from the old structure to the new HeroUI-based componentsV2 structure.

## Migrated Components

### CustomTag
- **Date**: 2025-09-19
- **Source**: `src/components/ui/CustomTag.tsx`
- **Destination**: `src/componentsV2/base/CustomTag.tsx`
- **Changes**:
  - **Component Migration**: Replaced Tamagui components with React Native/componentsV2 equivalents
    - Tamagui `XStack, Text` → componentsV2 `XStack, Text`
    - Added React Native `View` import for additional functionality
  - **Dynamic Styling Approach**: Maintained dynamic sizing logic while integrating Tailwind
    - Kept `size`, `fontSize`, `padding`, `borderRadius` calculations using inline styles for dynamic values
    - Used Tailwind classes for static styling: `items-center gap-0.5`
    - Added `className` prop for additional customization
  - **Color System Enhancement**:
    - Updated default color from `'$background'` to semantic Tailwind classes: `'bg-background-primary dark:bg-background-primary-dark'`
    - Added intelligent color conversion function for backward compatibility
    - Implemented automatic text color selection based on background color
    - Added proper light/dark mode support: `text-text-primary dark:text-text-primary-dark`
  - **Styling Migration**:
    - `alignItems="center"` → `items-center`
    - `gap={2}` → `gap-0.5`
    - `fontWeight="500"` → `font-medium`
    - Dynamic props (fontSize, padding, borderRadius) kept as inline styles due to dynamic nature
  - **Type Safety**: Enhanced CustomTagProps with optional `className` prop
  - **Export Integration**: Added to componentsV2/index.ts exports

### ChatScreen HeaderBar
- **Date**: 2025-09-19
- **Source**: `src/componentsV2/features/ChatScreen/HeaderBar/index.tsx`
- **Destination**: `src/componentsV2/features/ChatScreen/HeaderBar/index.tsx` (in-place migration)
- **Changes**:
  - **Icon Migration**: Migrated Menu icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
    - Updated import: `import { Menu } from '@tamagui/lucide-icons'` → `import { Menu } from '@/componentsV2/icons/LucideIcon'`
    - Icon usage remains: `<Menu size={24} />` (following size prop convention)
  - **Component Migration**: Replaced Tamagui XStack with componentsV2 XStack
    - Updated imports: `import { XStack } from 'tamagui'` → `import { XStack, IconButton } from '@/componentsV2'`
    - Consolidated IconButton import from componentsV2
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes
    - `alignItems="center" height={44} justifyContent="space-between" paddingHorizontal={14}` → `items-center h-11 justify-between px-3.5`
    - `alignItems="center" minWidth={40}` → `items-center min-w-10`
    - `flex={1} justifyContent="center" alignItems="center"` → `flex-1 justify-center items-center`
    - `alignItems="center" minWidth={40} justifyContent="flex-end"` → `items-center min-w-10 justify-end`
  - **Import Organization**: Reorganized imports for better grouping (React Navigation, React, componentsV2, icons, hooks, types, utils, external components)

### MenuButton
- **Date**: 2025-09-19
- **Source**: `src/components/header-bar/MenuButton.tsx`
- **Destination**: `src/componentsV2/features/HeaderBar/MenuButton.tsx`
- **Changes**:
  - **Icon Migration**: Migrated Menu icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
    - Updated import: `import { Menu } from '@tamagui/lucide-icons'` → `import { Menu } from '@/componentsV2/icons/LucideIcon'`
    - Icon usage remains: `<Menu size={24} />` (following size prop convention)
  - **Component Migration**: Replaced Tamagui Button with pure React Native TouchableOpacity
    - Removed: `import { Button } from 'tamagui'` and complex Button with icon prop
    - Simplified to: Direct TouchableOpacity with Menu icon child
    - Removed redundant nested TouchableOpacity (original had TouchableOpacity wrapping Button)
  - **Styling Migration**: Added Tailwind classes for consistent styling
    - Added container styling: `w-6 h-6 items-center justify-center rounded-full`
    - Maintained hitSlop for better touch target: `{ top: 10, bottom: 10, left: 10, right: 10 }`
  - **Code Simplification**:
    - Removed Tamagui Button props: `size={24} circular icon={<Menu size={24} />} unstyled`
    - Simplified to clean TouchableOpacity with direct icon
    - Removed unnecessary comment `// components/left-section.tsx`
  - **Export Integration**: Added to componentsV2/index.ts exports under HeaderBar section

### NewTopicButton
- **Date**: 2025-09-19
- **Source**: `src/components/header-bar/NewTopicButton.tsx`
- **Destination**: `src/componentsV2/features/HeaderBar/NewTopicButton.tsx`
- **Changes**:
  - **Icon Migration**: Migrated MessageSquareDiff icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
    - Updated import: `import { MessageSquareDiff } from '@tamagui/lucide-icons'` → `import { MessageSquareDiff } from '@/componentsV2/icons/LucideIcon'`
    - Icon usage remains: `<MessageSquareDiff size={24} />` (following size prop convention)
  - **Component Migration**: Replaced Tamagui components with componentsV2 equivalents
    - Updated imports: `import { Text, YStack } from 'tamagui'` → `import { Text, YStack } from '@/componentsV2'`
    - Updated EmojiAvatar import to relative path within componentsV2
  - **Styling Migration**: Replaced Tamagui styling props with Tailwind classes including light/dark mode variants
    - `gap={3}` → `gap-0.5`
    - `fontSize={16} lineHeight={18}` → `text-base leading-[18px] text-text-primary dark:text-text-primary-dark`
    - `fontSize={12} color="$textSecondary" opacity={0.7}` → `text-xs text-text-secondary dark:text-text-secondary-dark opacity-70`
  - **Code Quality**:
    - Added missing dependency `isDark` and `handleSelectAssistant` to useMemo deps array
    - Maintained all existing functionality (press, long press, selection sheet, haptic feedback)
    - Preserved React Native Pressable with className for active state
  - **Import Organization**: Reorganized imports for better grouping (external libs, componentsV2, internal components, hooks, services, store, types, utils)
  - **Export Integration**: Added to componentsV2/index.ts exports under HeaderBar section

### AssistantSelection
- **Date**: 2025-09-19
- **Source**: `src/components/header-bar/AssistantSelection.tsx`
- **Destination**: `src/componentsV2/features/ChatScreen/Header/AssistantSelection.tsx`
- **Changes**:
  - **Component Migration**: Replaced Tamagui components with React Native/componentsV2 equivalents
    - Updated imports: `import { Button, Text, XStack, YStack } from 'tamagui'` → `import { Text, XStack, YStack } from '@/componentsV2'`
    - Replaced Tamagui Button with React Native Pressable for better control and consistency
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes including light/dark mode variants
    - Button press style: `pressStyle={{ opacity: 0.6 }}` → `className="active:opacity-60"`
    - Container layout: `gap={14} alignItems="center" justifyContent="center"` → `gap-3.5 items-center justify-center`
    - Inner container: `gap={2} alignItems="center" justifyContent="flex-start"` → `gap-0.5 items-center justify-start`
    - Assistant name: `color="$textPrimary" fontSize={16}` → `text-text-primary dark:text-text-primary-dark text-base`
    - Topic name: `fontSize={11} color="$gray11"` → `text-[11px] text-gray-60 dark:text-gray-60`
  - **Code Simplification**:
    - Removed Tamagui Button wrapper, simplified to direct Pressable with Tailwind active state
    - Maintained all functionality (bottom sheet presentation, navigation, action button)
  - **File Organization**:
    - Moved to ChatScreen-specific location as requested
    - No export integration needed (internal component)
    - Updated AssistantItemSheet import to relative path within componentsV2

### Select (ISelect)
- **Date**: 2025-09-19
- **Source**: `src/components/ui/Select.tsx`
- **Destination**: `src/componentsV2/base/Select.tsx`
- **Changes**:
  - **Icon Migration**: Migrated ChevronRight icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
    - Updated import: `import { ChevronRight } from '@tamagui/lucide-icons'` → `import { ChevronRight } from '@/componentsV2/icons/LucideIcon'`
    - Icon styling: `size={16} color="$textSecondary" opacity={0.9} marginRight={-4}` → `size={16} className="text-text-secondary dark:text-text-secondary-dark opacity-90 -mr-1"`
  - **Component Migration**: Replaced Tamagui components with componentsV2 equivalents
    - Updated imports: `import { Text, XStack } from 'tamagui'` → `import { Text, XStack } from '@/componentsV2'`
    - Maintained Zeego dropdown functionality (external dependency preserved)
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes including light/dark mode variants
    - **Main container**: `width={width} height={46} paddingVertical={12} paddingHorizontal={16} alignItems="center" justifyContent="space-between" gap={10} borderRadius={16} backgroundColor="$uiCardBackground"` → `h-[46px] py-3 px-4 items-center justify-between gap-2.5 rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark`
    - **Content container**: `flex={1} alignItems="center" overflow="hidden" justifyContent="space-between"` → `flex-1 items-center overflow-hidden justify-between`
    - **Group label**: `flexShrink={1}` → `flex-shrink text-text-primary dark:text-text-primary-dark`
    - **Item label**: `flexShrink={0} maxWidth="60%"` → `flex-shrink-0 max-w-[60%] text-text-primary dark:text-text-primary-dark`
    - **Placeholder**: `flex={1}` → `flex-1 text-text-secondary dark:text-text-secondary-dark`
  - **Props Enhancement**: Added optional `className` prop for additional customization
  - **Type Safety**: Maintained all existing TypeScript interfaces and generics
  - **Functionality Preserved**: All dropdown behavior, value selection, display logic maintained
  - **Export Integration**: Added to componentsV2/index.ts exports under base components

### EmptyModelView
- **Date**: 2025-09-19
- **Source**: `src/components/settings/providers/EmptyModelView.tsx`
- **Destination**: `src/componentsV2/features/SettingsScreen/EmptyModelView.tsx`
- **Changes**:
  - **Component Migration**: Replaced Tamagui components with componentsV2 equivalents
    - Updated imports: `import { Text, YStack } from 'tamagui'` → `import { Text, YStack } from '@/componentsV2'`
    - No additional dependencies required for this simple empty state component
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes including light/dark mode variants
    - **Outer container**: `gap={51} width="100%" alignItems="center"` → `gap-12 w-full items-center`
    - **Inner container**: `gap={12}` → `gap-3`
    - **Text styling**: `fontSize={30} fontWeight="bold" textAlign="center"` → `text-3xl font-bold text-center text-text-primary dark:text-text-primary-dark`
  - **Functionality Preserved**: Maintained all internationalization with useTranslation hook
  - **File Organization**: Moved to SettingsScreen feature directory as requested
  - **Code Quality**: Simple component structure maintained, no complex state or interactions
  - **Export Integration**: No export integration needed (internal settings component)

### MenuTabContent
- **Date**: 2025-09-19
- **Source**: `src/components/menu/MenuTabContent.tsx`
- **Destination**: `src/componentsV2/features/Menu/MenuTabContent.tsx`
- **Changes**:
  - **Component Migration**: Replaced Tamagui components with componentsV2 equivalents
    - Updated imports: `import { Text, XStack, YStack } from 'tamagui'` → `import { Text, XStack, YStack } from '@/componentsV2'`
    - Maintained React Native TouchableOpacity for touch interactions
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes including light/dark mode variants
    - **Main container**: `flex={1} gap={10}` → `flex-1 gap-2.5`
    - **Header container**: `paddingHorizontal={20}` → `px-5`
    - **Title row**: `justifyContent="space-between" alignItems="center"` → `justify-between items-center`
    - **Title group**: `paddingVertical={10} gap={8} alignItems="center"` → `py-2.5 gap-2 items-center`
    - **Title text**: No explicit Tamagui styling → `text-text-primary dark:text-text-primary-dark`
    - **See all text**: `color="$textLink"` → `text-text-link dark:text-text-link-dark`
  - **Functionality Preserved**: All props interface, children rendering, and TouchableOpacity with hitSlop maintained
  - **Code Quality**: Simple layout component with title and see-all action maintained
  - **File Organization**: Moved to Menu feature directory as requested
  - **Export Integration**: No export integration needed (internal menu component)

### CustomDrawerContent
- **Date**: 2025-09-19
- **Source**: `src/components/menu/CustomDrawerContent.tsx`
- **Destination**: `src/componentsV2/features/Menu/CustomDrawerContent.tsx`
- **Changes**:
  - **Component Migration**: Replaced Tamagui components with componentsV2 equivalents
    - Updated imports: `import { Avatar, Stack, styled, Text, View, XStack, YStack } from 'tamagui'` → `import { Text, XStack, YStack, Image } from '@/componentsV2'`
    - Added React Native Pressable import for interactive elements
  - **Icon Migration**: Migrated Settings icon from @tamagui/lucide-icons to LucideIcon system
    - Updated import: `import { Settings } from '@tamagui/lucide-icons'` → `import { Settings2 } from '@/componentsV2/icons/LucideIcon'`
    - Icon usage: `<Settings size={24} color="$textPrimary" />` → `<Settings2 size={24} className="text-text-primary dark:text-text-primary-dark" />`
  - **Avatar Replacement**: Replaced Tamagui Avatar with Image component as requested
    - **Before**: Complex Tamagui Avatar with `Avatar.Image`, `Avatar.Fallback`, circular prop, size={48}
    - **After**: Simple Image component: `<Image className="w-12 h-12 rounded-full" source={avatar ? { uri: avatar } : require('@/assets/images/favicon.png')} />`
    - Simplified avatar handling while maintaining fallback to favicon.png
  - **Styled Component Removal**: Replaced styled ListItem with Pressable and Tailwind classes
    - **Before**: `const ListItem = styled(XStack, { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 9, pressStyle: { backgroundColor: '$gray20' } })`
    - **After**: Direct Pressable with Tailwind: `className="justify-between items-center py-2.5 px-2.5 rounded-lg active:bg-gray-20 dark:active:bg-gray-20-dark"`
  - **Styling Migration**: Replaced all Tamagui styling props with Tailwind classes including light/dark mode variants
    - **Main container**: `gap={10} flex={1}` → `gap-2.5 flex-1`
    - **Menu section**: `gap={6} paddingHorizontal={10}` → `gap-1.5 px-2.5`
    - **List items**: Complex styled component → `justify-between items-center py-2.5 px-2.5 rounded-lg active:bg-gray-20 dark:active:bg-gray-20-dark`
    - **Icon groups**: `gap={10} alignItems="center" justifyContent="center"` → `gap-2.5 items-center justify-center`
    - **Text styling**: `fontSize={16} color="$textPrimary"` → `text-base text-text-primary dark:text-text-primary-dark`
    - **Bottom section**: `paddingHorizontal={20} paddingBottom={10}` → `px-5 pb-2.5`
    - **Footer row**: `paddingHorizontal={20} justifyContent="space-between" alignItems="center"` → `px-5 justify-between items-center`
    - **User section**: `gap={10} alignItems="center" pressStyle={{ opacity: 0.7 }}` → `gap-2.5 items-center active:opacity-70`
    - **Topic list container**: `flex={1} minHeight={200}` → `flex-1 min-h-[200px]`
  - **Import Updates**: Updated SafeAreaContainer import to use old path temporarily, MenuTabContent to relative import
  - **Functionality Preserved**: All navigation handlers, haptic feedback, topic management, and drawer props maintained
  - **Code Quality**: Simplified component structure while maintaining all interactions and visual hierarchy
  - **Export Integration**: No export integration needed (internal drawer component)