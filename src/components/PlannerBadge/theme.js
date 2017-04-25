/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ colors, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    countBackgroundColor: colors.crimson,
    countTextColor: colors.white,
    countFontSize: typography.fontSizeXSmall,
    countPadding: spacing.xxSmall,
    badgeSize: '1.25rem'
  };
}
