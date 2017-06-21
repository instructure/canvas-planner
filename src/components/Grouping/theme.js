/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    lineHeight: typography.lineHeightCondensed,
    margin: `${spacing.medium} 0 0 0`,

    groupColor: colors.brand,

    borderTopWidthTabletUp: borders.widthSmall,

    heroMinHeight: '7rem',
    heroWidth: '12rem',
    heroWidthLarge: '14rem',
    heroPadding: '0 0.0625rem',
    heroColor: colors.brand,
    heroBorderRadius: borders.radiusMedium,

    overlayOpacity: 0.75,

    titleFontSize: typography.fontSizeXSmall,
    titleFontWeight: typography.fontWeightBold,
    titleLetterSpacing: '0.0625rem',
    titleBackground: colors.white,
    titleTextTransform: 'uppercase',
    titlePadding: `${spacing.xxSmall} ${spacing.xSmall}`,
    titleTextDecoration: 'none',
    titleTextDecorationHover: 'underline',
    titleColor: colors.brand,
    activityIndicatorPadding: spacing.small,
    activityIndicatorWidth: spacing.small,
    ...media
  };
}

generator['canvas-a11y'] = generator['modern-a11y'] = function ({ colors }) {
  return {
    heroTextDecoration: 'underline',
    heroTextDecorationHover: 'none',
    titleColor: colors.licorice,
  };
};

generator.canvas = function (variables) {
  return {
    groupColor: variables["ic-brand-primary"],
    titleColor: variables["ic-brand-primary"]
  };
};
