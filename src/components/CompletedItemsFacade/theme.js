/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    color: colors.licorice,

    padding: `${spacing.small} ${spacing.xSmall}`,
    paddingMedium: `${spacing.small}`,
    paddingLarge: `${spacing.small} ${spacing.medium}`,

    borderWidth: borders.widthSmall,
    borderColor: colors.tiara,
    bottomMarginPhoneUp: spacing.xSmall,

    buttonPadding: `${spacing.xSmall} 0`,
    buttonFontSize: typography.fontSizeMedium,
    buttonTextDecorationHover: 'underline',
    buttonColor: colors.brand,

    checkboxRightMarginPhoneUp: spacing.small,
    checkboxRightMarginWideUp: spacing.medium,

    badgeMargin: '0.0625rem',

    ...media
  };
}
