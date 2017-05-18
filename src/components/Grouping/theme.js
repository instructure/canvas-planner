/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    borderTopWidthTabletUp: borders.widthSmall,
    groupingTopMargin: spacing.medium,
    groupingHeroMinHeight: '7rem',
    groupingHeroWidth: '12rem',
    heroLinkColor: colors.brand,
    heroLinkTextDecoration: 'none',
    heroLinkTextDecorationHover: 'underline',
    heroLinkTextTransform: 'uppercase',
    heroLinkFontSize: typography.fontSizeXSmall,
    heroLinkFontWeight: typography.fontWeightBold,
    heroLinkLetterSpacing: '0.0625rem',
    heroLinkNameBackground: colors.white,
    heroLinkNameTextTransform: 'uppercase',
    heroLinkNamePadding: `${spacing.xxSmall} ${spacing.xSmall}`,
    heroBorderRadius: borders.radiusMedium,
    heroLinkPadding: '0 0.0625rem',
    defaultIconColor: colors.brand,
    activityIndicatorPadding: spacing.small,
    activityIndicatorWidth: spacing.small,
    ...media
  };
}

generator['canvas-a11y'] = generator['modern-a11y'] = function ({ colors }) {
  return {
    heroLinkTextDecoration: 'underline',
    heroLinkTextDecorationHover: 'none',
  };
};

generator.canvas = function (variables) {
  return {
    defaultIconColor: variables["ic-brand-primary"],
  };
};
