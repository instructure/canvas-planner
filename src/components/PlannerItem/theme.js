export default function generator ({ borders, colors, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    lineHeight: typography.lineHeightCondensed,
    color: colors.licorice,

    padding: `${spacing.small} ${spacing.xSmall}`,
    paddingMedium: `${spacing.small}`,
    paddingLarge: `${spacing.small} ${spacing.medium}`,

    gutterWidth: spacing.small,
    gutterWidthXLarge: spacing.medium,

    bottomMargin: spacing.xSmall,

    borderWidth: borders.widthSmall,
    borderColor: colors.tiara,

    iconFontSize: spacing.medium,
    iconColor: colors.brand,
    badgeMargin: '0.0625rem',

    metricsPadding: spacing.xxSmall,

    typeMargin: spacing.xxxSmall,

    titleLineHeight: typography.lineHeightFit
  };
}

generator.canvas = function (variables) {
  return {
    iconColor: variables["ic-brand-primary"],
  };
};
