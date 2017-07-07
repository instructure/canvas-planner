/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
