export default function generator ({ colors, typography, spacing }) {
  return {
    fontSize: typography.fontSizeSmall,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    color: colors.slate,
    messageMargin: spacing.xSmall,
    margin: spacing.xSmall
  };
}
