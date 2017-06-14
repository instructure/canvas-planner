import { darken } from 'instructure-ui/lib/util/color';

export default function generator ({ borders, colors, typography, spacing }) {
  return {
    fontSize: typography.fontSizeXSmall,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    color: colors.white,
    background: colors.brand,
    backgroundHover: darken(colors.brand, 5),
    padding: `0 ${spacing.small}`,
    textTransform: 'uppercase',
    lineHeight: spacing.medium,
    iconMargin: spacing.xxSmall,
    hasIconRightPadding: spacing.xSmall,
    borderRadius: borders.radiusMedium,
    focusRingWidth: borders.widthSmall,
    focusRingColor: colors.brand
  };
}

generator.canvas = function (variables) {
  return {
    background: variables["ic-brand-primary"],
    backgroundHover: darken(variables["ic-brand-primary"], 5),
    focusRingColor: variables["ic-brand-primary"],
  };
};
