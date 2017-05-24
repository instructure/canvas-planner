export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    color: colors.licorice,
    paddingPhoneUp: `${spacing.small} 0`,
    paddingTabletUp: `${spacing.small}`,
    paddingWideUp: `${spacing.small} ${spacing.medium}`,
    borderWidth: borders.widthSmall,
    borderColor: colors.tiara,
    iconFontSize: spacing.medium,
    iconCheckboxRightMarginPhoneUp: spacing.small,
    iconCheckboxRightMarginWideUp: spacing.medium,
    itemDetailsBottomMargin: spacing.xSmall,
    itemTypeBottomMargin: spacing.xxxSmall,
    itemTypeLetterSpacing: '0.0625rem',
    itemNameLineHeight: typography.lineHeightFit,
    defaultIconColor: colors.brand,

    badgeMargin: spacing.xxxSmall,

    ...media
  };
}

generator.canavs = function (variables) {
  return {
    defaultIconColor: variables["ic-brand-primary"],
  };
};
