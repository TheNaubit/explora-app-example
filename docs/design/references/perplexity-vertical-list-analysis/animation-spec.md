# Perplexity vertical list animation analysis

## Source

- Page: [Perplexity Vertical List Animation](https://www.animatereactnative.com/post/perplexity-vertical-list-animation-reanimated)
- Local reference: `../perplexity-vertical-list-reference.mp4`
- Frame size: 320 by 694 pixels.
- Frame rate: 60 frames per second.
- Duration: 5.4167 seconds.

Implementation captures:

- [Expanded header](./implementation-expanded.jpg)
- [Collapsed header](./implementation-collapsed.jpg)

The recording has no touch indicator. It also does not expose the original layout values.

## Measured visual model

| Property         |     Focused card |     Adjacent card | Confidence |
| ---------------- | ---------------: | ----------------: | ---------- |
| Width            | About 292 pixels |  About 270 pixels | Medium     |
| Height           | About 432 pixels | Content dependent | Medium     |
| Relative scale   |             1.00 |        About 0.92 | Medium     |
| Relative opacity |             1.00 |        About 0.52 | Low        |
| Item stride      | About 463 pixels |              Same | Medium     |
| Visible gap      |  About 31 pixels |              Same | Medium     |

The source drives scale and opacity from the scroll position. It does not use a separate entrance animation.

For item `i`, use `i * itemExtent` as its focus offset. Clamp the effect outside one item extent.

```text
input:   [(i - 1) * extent, i * extent, (i + 1) * extent]
scale:   [0.92,               1.00,       0.92]
opacity: [0.52,               1.00,       0.52]
```

Use fast list deceleration and interval snapping. The finger and scroll engine determine the transition duration.

## Explora adaptation

- Use `AnimatedLegendList` from Legend List.
- Keep a four-point layout gap between item slots.
- Let inactive scaling create the larger visible gap.
- Keep about 32 points between header controls and the focused card.
- Move cards with the collapsing iOS header.
- Play one soft Pulsar detent when a new card snap commits.
- Disable the carousel for reduced motion, web, or font scales above 1.3.
- Keep the standard list for those fallback states.
- Increase the iOS header reserve with Dynamic Type.

## Validation limits

The simulator verifies geometry, snapping, header motion, and adjacent-card cues. A simulator cannot verify physical haptic quality.

The app uses different content and dimensions from the source. Pixel similarity is not a valid success metric for this comparison.
