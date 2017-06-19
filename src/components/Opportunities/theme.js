/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, spacing, typography }) {
  return {
    padding: `${spacing.xSmall} ${spacing.small} ${spacing.small}`,
    borderBottom: `${borders.widthSmall} ${borders.style} ${colors.tiara}`,
    borderColor: colors.tiara,
    borderWidth: borders.widthSmall,
    borderStyle: borders.style,
    itemMargin: spacing.small,
    itemPadding: spacing.xxSmall
  };
}
