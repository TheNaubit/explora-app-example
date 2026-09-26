type HeroStretch = {
  scale: number;
  translateY: number;
};

const REST: HeroStretch = { scale: 1, translateY: 0 };

/**
 * Return the hero transform for a scroll offset.
 * A negative offset is a pull-down. The hero grows so that its top edge stays on the screen top
 * and its bottom edge stays still. Other offsets and an unmeasured hero return the rest state.
 */
export function getHeroStretch(offset: number, heroHeight: number): HeroStretch {
  "worklet";
  if (offset >= 0 || heroHeight <= 0) return REST;

  return { scale: 1 + -offset / heroHeight, translateY: offset / 2 };
}
