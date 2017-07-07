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
export default function generator ({ colors, spacing, typography }) {
  return {
    lineHeight: typography.lineHeightCondensed,
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    color: colors.licorice,
    secondaryColor: colors.slate,
    background: colors.white,
    namePaddingRight: spacing.xSmall,
    namePaddingTop: spacing.xxSmall,
    nameFontSize: typography.fontSizeSmall,
    statusPadding: spacing.small,
    dueFontSize: typography.fontSizeXSmall,
    dueMargin: spacing.xxSmall,
    dueTextFontWeight: typography.fontWeightBold,
    footerPadding: spacing.xSmall,
    pointsFontSize: typography.fontSizeXSmall,
    pointsNumberFontSize: typography.fontSizeLarge,
    pointsLineHeight: typography.lineHeightFit
  };
}
