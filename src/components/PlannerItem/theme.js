export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    itemPaddingPhoneUp: `${spacing.small} 0`,
    itemPaddingTabletUp: `${spacing.small}`,
    itemPaddingWideUp: `${spacing.small} ${spacing.medium}`,
    itemBorderWidth: borders.widthSmall,
    itemBorderColor: colors.tiara,
    iconFontSize: spacing.medium,
    iconCheckboxRightMarginPhoneUp: spacing.small,
    iconCheckboxRightMarginWideUp: spacing.medium,
    itemDetailsBottomMargin: spacing.xSmall,
    itemTypeBottomMargin: spacing.xxxSmall,
    itemTypeLetterSpacing: spacing.xxxSmall,
    itemNameLineHeight: typography.lineHeightFit,
    defaultIconColor: colors.brand,

    ...media
  };
}

generator.canavs = function (variables) {
  return {
    defaultIconColor: variables["ic-brand-primary"],
  };
};
