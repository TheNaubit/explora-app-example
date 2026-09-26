import { getHeroStretch } from "@/screens/activity-detail/hero-stretch";

describe("getHeroStretch", () => {
  it("keeps the hero at rest when the content scrolls up or stays still", () => {
    expect(getHeroStretch(0, 400)).toEqual({ scale: 1, translateY: 0 });
    expect(getHeroStretch(120, 400)).toEqual({ scale: 1, translateY: 0 });
  });

  it("pins the top edge and the bottom edge during a pull-down", () => {
    const heroHeight = 400;
    const pull = -100;
    const { scale, translateY } = getHeroStretch(pull, heroHeight);
    const containerTop = -pull;
    const imageTop = containerTop + (heroHeight * (1 - scale)) / 2 + translateY;
    const imageBottom = containerTop + (heroHeight * (1 + scale)) / 2 + translateY;

    expect(scale).toBe(1.25);
    expect(imageTop).toBeCloseTo(0);
    expect(imageBottom).toBeCloseTo(containerTop + heroHeight);
  });

  it("returns the rest state before the hero has a height", () => {
    expect(getHeroStretch(-50, 0)).toEqual({ scale: 1, translateY: 0 });
  });
});
