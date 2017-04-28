/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    borderTopWidthPhone: borders.widthMedium,
    borderTopWidthTabletUp: borders.widthSmall,
    groupingTopMargin: spacing.medium,
    groupingHeroMinHeight: '7rem',
    groupingHeroWidth: '12rem',
    groupingHeroPadding: spacing.small,
    heroLinkColor: colors.white,
    heroLinkTextDecoration: 'none',
    heroLinkTextDecorationHover: 'underline',
    heroLinkTextTransform: 'uppercase',
    heroLinkFontSize: typography.fontSizeSmall,
    heroLinkLetterSpacing: spacing.xxxSmall,
    heroBorderRadius: borders.radiusLarge,
    defaultIconColor: colors.brand,
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
