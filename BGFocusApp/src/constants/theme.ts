import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, ICON_SIZES } from './spacing';

export const THEME = {
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  fontSize: FONT_SIZES,
  fontWeight: FONT_WEIGHTS,
  iconSize: ICON_SIZES,
};


export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    tension: 300,
    friction: 30,
  },
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
};

export const LAYOUT = {
  headerHeight: 60,
  tabBarHeight: 80,
  screenPadding: SPACING.md,
  cardPadding: SPACING.md,
  sectionSpacing: SPACING.lg,
};
