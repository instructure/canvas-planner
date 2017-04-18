export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    itemPaddingSmallScreen: `${spacing.small} 0`,
    itemPaddingMediumScreen: `${spacing.small} ${spacing.xSmall}`,
    itemPaddingLargeScreen: `${spacing.small}`,
    itemBorderWidth: borders.widthSmall,
    itemBorderColor: colors.tiara,
    iconFontSize: spacing.medium,
    iconCheckboxRightMargin: spacing.small,
    itemDetailsBottomMargin: spacing.xSmall,
    itemTypeBottomMargin: spacing.xxxSmall,
    itemNameLineHeight: typography.lineHeightFit,

    ...media
  }
}
