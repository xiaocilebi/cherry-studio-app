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