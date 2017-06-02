/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

export default function generator ({ colors, typography }) {
  const cssVars = {
    background: colors.white
  };
  return cssVars;
}
