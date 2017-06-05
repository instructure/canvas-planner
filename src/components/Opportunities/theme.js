/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, spacing, typography }) {
  return {
    padding: spacing.small,
    itemBorderWidth: borders.widthSmall,
    itemBorderColor: colors.tiara,
    itemBorderStyle: borders.style,
    itemMargin: spacing.small
  };
}
