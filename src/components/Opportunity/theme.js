export default function generator ({ colors, spacing, typography }) {
  return {
    lineHeight: typography.lineHeightCondensed,
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    color: colors.licorice,
    secondaryColor: colors.slate,
    background: colors.white,
    namePaddingRight: spacing.xSmall,
    namePaddingTop: spacing.xxSmall,
    nameFontSize: typography.fontSizeSmall,
    statusPadding: spacing.small,
    dueFontSize: typography.fontSizeXSmall,
    dueMargin: spacing.xxSmall,
    dueTextFontWeight: typography.fontWeightBold,
    footerPadding: spacing.xSmall,
    pointsFontSize: typography.fontSizeXSmall,
    pointsNumberFontSize: typography.fontSizeLarge,
    pointsLineHeight: typography.lineHeightFit
  };
}
