/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ colors, typography, spacing}) {
  return {
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,

    color: colors.oxford,
    background: colors.whiterails,

    lightWeight: typography.fontWeightLight,
    smallSpacing: spacing.small,
    largeSpacing: spacing.large,
    xxLargeSpacing: spacing.xxLarge
  };
}
