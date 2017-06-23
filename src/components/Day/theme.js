/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ colors, typography, spacing }) {
  return {
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    lineHeight: typography.lineHeightCondensed,

    color: colors.oxford,
    background: colors.white,

    marginTop: spacing.large
  };
}
