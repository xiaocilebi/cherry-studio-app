# Component Migration Log

This file tracks the migration of components from the old structure to the new HeroUI-based componentsV2 structure.

## Migrated Components

### AssistantItemSkeleton
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/AssistantItemSkeleton.tsx`
- **Destination**: `src/componentsV2/features/AssistantItemSkeleton.tsx`
- **Changes**:
  - Migrated from Tamagui View to React Native View
  - Updated styling to use Tailwind classes
  - Replaced `paddingVertical={10} paddingHorizontal={10} borderRadius={16} backgroundColor="$uiCardBackground"` with `py-2.5 px-2.5 rounded-2xl bg-ui-card-background`
  - Maintained ContentLoader functionality and theming support

### AssistantItem
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/AssistantItem.tsx`
- **Destination**: `src/componentsV2/features/Assistant/AssistantItem.tsx`
- **Changes**:
  - Migrated from Tamagui components (Text, XStack, YStack) to componentsV2 equivalents
  - Updated main container from Tamagui XStack to React Native View with Tailwind classes
  - Replaced Tamagui styling props with Tailwind classes:
    - `paddingVertical={10} paddingHorizontal={10} justifyContent="space-between" alignItems="center" borderRadius={16} backgroundColor="$uiCardBackground"` → `py-2.5 px-2.5 justify-between items-center rounded-2xl bg-ui-card-background`
    - `gap={14} flex={1}` → `gap-3.5 flex-1`
    - `gap={4} flex={1} justifyContent="center"` → `gap-1 flex-1 justify-center`
    - `fontSize={14} fontWeight="bold" color="$textPrimary"` → `text-sm font-bold text-text-primary`
    - `fontSize={12} lineHeight={18} color="$textSecondary"` → `text-xs leading-[18px] text-text-secondary`
  - Updated imports to use componentsV2 Text, XStack, YStack
  - Updated EmojiAvatar import to relative path
  - Migrated Trash2 icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
  - Updated androidIcon to use Tailwind classes: `<Trash2 size={16} color="red" />` → `<Trash2 className="w-4 h-4 text-red-100" />`

### AssistantItemCard
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/AssistantItemCard.tsx`
- **Destination**: `src/componentsV2/features/Assistant/AssistantItemCard.tsx`
- **Changes**:
  - Migrated from Tamagui components (Text, View, XStack, YStack) to React Native View, Pressable and componentsV2 equivalents
  - Updated main container from Tamagui View to React Native Pressable with Tailwind classes
  - Replaced Tamagui styling props with Tailwind classes including proper light/dark mode variants:
    - `padding={6}` → `p-1.5`
    - `height={230} backgroundColor="$uiCardBackground" borderRadius={16} overflow="hidden"` → `h-[230px] bg-ui-card-background dark:bg-ui-card-background-dark rounded-2xl overflow-hidden`
    - `pressStyle={{ backgroundColor: '$gray20' }}` → `active:bg-gray-20 dark:active:bg-gray-20`
    - `width={'100%'} height={'50%'} top={0} left={0} right={0} position="absolute" flexWrap="wrap"` → `w-full h-1/2 absolute top-0 left-0 right-0 flex-wrap`
    - `width={'25%'} scale={1.5} alignItems="center" justifyContent="center"` → `w-1/4 scale-150 items-center justify-center`
    - `fontSize={40} opacity={emojiOpacity}` → `text-[40px]` with inline style for opacity
    - `flex={1} gap={8} alignItems="center" borderRadius={16} paddingVertical={16} paddingHorizontal={14}` → `flex-1 gap-2 items-center rounded-2xl py-4 px-3.5`
    - `fontSize={16} textAlign="center"` → `text-base text-center text-text-primary dark:text-text-primary-dark`
    - `color="$textSecondary" fontSize={12} lineHeight={14}` → `text-text-secondary dark:text-text-secondary-dark text-xs leading-[14px]`
    - `gap={10} flexWrap="wrap" height={18} justifyContent="center" overflow="hidden"` → `gap-2.5 flex-wrap h-[18px] justify-center overflow-hidden`
  - Updated imports to use componentsV2 Text, XStack, YStack
  - Updated EmojiAvatar and GroupTag imports to relative paths
  - Created migrated GroupTag component with Tailwind styling

### GroupTag
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/market/GroupTag.tsx`
- **Destination**: `src/componentsV2/features/Assistant/GroupTag.tsx`
- **Changes**:
  - Migrated from Tamagui Text to componentsV2 Text
  - Replaced Tamagui styling props with Tailwind classes:
    - `borderRadius={20} paddingVertical={2} paddingHorizontal={4}` → `rounded-[20px] py-0.5 px-1`
  - Updated props to use className for Tailwind styling
  - Enhanced GroupTagProps to properly extend componentsV2 TextProps

### AssistantMarketLoading
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/market/AssistantMarketLoading.tsx`
- **Destination**: `src/componentsV2/features/Assistant/AssistantMarketLoading.tsx`
- **Changes**:
  - Migrated Menu icon from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
  - Updated Menu icon styling to use Tailwind classes: `<Menu size={24} />` → `<Menu className="w-6 h-6" />`
  - Reorganized imports for better grouping
  - Component structure remained the same, using existing HeaderBar from componentsV2

### AssistantsTabContent
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/market/AssistantsTabContent.tsx`
- **Destination**: `src/componentsV2/features/Assistant/AssistantsTabContent.tsx`
- **Changes**:
  - Migrated from Tamagui components (Text, YStack) to componentsV2 equivalents
  - Replaced Tamagui styling props with Tailwind classes including light/dark mode variants:
    - `flex={1} justifyContent="center" alignItems="center" padding={20}` → `flex-1 justify-center items-center p-5`
    - `color="$color10" fontSize={16}` → `text-gray-60 dark:text-gray-60 text-base`
    - `flex={1}` → `flex-1`
  - Updated AssistantItemCard import to relative path
  - Maintained FlashList functionality and performance optimizations
  - Updated imports to use componentsV2 Text and YStack

### AssistantItemSheet
- **Date**: 2025-09-19
- **Source**: `src/components/assistant/market/AssistantItemSheet.tsx`
- **Destination**: `src/componentsV2/features/Assistant/AssistantItemSheet.tsx`
- **Changes**:
  - **Icon Migration**: Migrated Settings2 and X icons from @tamagui/lucide-icons to @/componentsV2/icons/LucideIcon
    - Added X icon to LucideIcon system (import, interop, wrapper, export)
    - Updated icon styling: `<Settings2 size={30} color="$textPrimary" />` → `<Settings2 className="w-7 h-7 text-text-primary dark:text-text-primary-dark" />`
    - Updated icon styling: `<X size={16} />` → `<X className="w-4 h-4" />`
  - **Component Migration**: Replaced Tamagui components with React Native/componentsV2 equivalents
    - Tamagui `Button, Text, View, XStack, YStack` → React Native `View, TouchableOpacity` + componentsV2 `Text, XStack, YStack`
    - Updated imports to use componentsV2 Text, XStack, YStack
  - **HeroUI Button Migration**: Updated to new HeroUI Button syntax
    - Icon-only buttons: `<Button chromeless circular size="$5" icon={<Icon />} onPress={...} />` → `<Button isIconOnly onPress={...}><Button.LabelContent><Icon /></Button.LabelContent></Button>`
    - Text buttons: `<Button ... onPress={...}><Text ...>text</Text></Button>` → `<Button ... onPress={...}><Button.LabelContent><Text ...>text</Text></Button.LabelContent></Button>`
  - **Tailwind Styling with Light/Dark Mode**: Replaced all Tamagui styling props with Tailwind classes
    - `flex={1} gap={40} position="relative"` → `flex-1 gap-10 relative`
    - `width={'100%'} height={200} borderRadius={30} top={0} left={0} right={0} overflow="hidden" position="absolute" flexWrap="wrap"` → `w-full h-[200px] rounded-[30px] absolute top-0 left-0 right-0 overflow-hidden flex-wrap`
    - `width={'9.99%'} scale={1.5} alignItems="center" justifyContent="center"` → `w-[9.99%] scale-150 items-center justify-center`
    - `fontSize={20} opacity={emojiOpacity}` → `text-[20px]` with inline style for opacity
    - `flex={1} gap={16} paddingHorizontal={25}` → `flex-1 gap-4 px-6`
    - `justifyContent="center" alignItems="center" gap={20}` → `justify-center items-center gap-5`
    - `marginTop={20}` → `mt-5`
    - `fontSize={22} fontWeight="bold" textAlign="center"` → `text-[22px] font-bold text-center text-text-primary dark:text-text-primary-dark`
    - `gap={10} flexWrap="wrap" justifyContent="center"` → `gap-2.5 flex-wrap justify-center`
    - `gap={2} alignItems="center" justifyContent="center"` → `gap-0.5 items-center justify-center`
    - `fontSize={14}` → `text-sm text-text-primary dark:text-text-primary-dark`
    - `gap={16}` → `gap-4`
    - `gap={5}` → `gap-1`
    - `lineHeight={20} fontSize={18} fontWeight="bold" color="$textPrimary"` → `leading-5 text-lg font-bold text-text-primary dark:text-text-primary-dark`
    - `lineHeight={20} color="$textSecondary"` → `leading-5 text-text-secondary dark:text-text-secondary-dark`
    - `fontSize={16} lineHeight={20}` → `text-base leading-5 text-text-primary dark:text-text-primary-dark`
    - `paddingHorizontal={25} bottom={bottom} justifyContent="space-between" alignItems="center" gap={15} flexShrink={0}` → `px-6 justify-between items-center gap-4 flex-shrink-0`
    - `backgroundColor="$green10" borderColor="$green20" borderRadius={30} paddingVertical={10} paddingHorizontal={20} flex={1}` → `bg-green-10 dark:bg-green-dark-10 border-green-20 dark:border-green-dark-20 rounded-[30px] py-2.5 px-5 flex-1`
    - `color="$green100" fontSize={17} fontWeight="700"` → `text-green-100 dark:text-green-dark-100 text-[17px] font-bold`
  - Updated EmojiAvatar and GroupTag imports to relative paths