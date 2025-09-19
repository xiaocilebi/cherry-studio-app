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