# Threads pull-to-refresh reference

## Source

- Video: <https://cdn.designspells.com/videos/threads.mp4>
- Capture: 1920 × 1080, 60 frames per second, 5.98 seconds
- Analysis date: 2026-09-24

The source video shows the visual interaction only. The user supplied the haptic behavior description.

## Observed behavior

1. The mark appears as the list moves below its resting position.
2. The complete mark stays visible as a quiet gray track.
3. Frames 295–330 show the dark stroke growing continuously along the gray track.
4. The pull does not swap a partial segment for a completed outline.
5. The completed mark stays hollow. Its interior does not fill.
6. A short dark segment moves along that track during refresh.
7. The list stays visible during refresh.

## Explora adaptation

- Use the Explora monochrome app mark instead of the Threads mark.
- Map 72 points of overscroll to progress from 0 to 1.
- Grow one continuous stroke around the gray mark during the pull.
- Map stroke length, opacity, and scale directly to pull progress.
- Blend the stroke from the primary text color to the accent color.
- Keep the mark hollow at completed pull, so the silhouette stays clear.
- Show a 760 millisecond loading sweep while the refresh request is pending.
- Move the loading dash along the path. Do not rotate the non-circular mark.
- Keep the platform `RefreshControl` gesture and use the custom 72-point completion threshold.
- Hide only the platform spinner.
- Start the request immediately when pull progress reaches 1.
- Commit the gesture once and ignore the later native release callback.
- Reset incomplete pulls on drag end. Ignore rebound events until the next drag starts.
- Reset completed progress after refresh ends.
- Insert the successful refresh activity at the start of the catalog.

## Haptic adaptation

- Use Pulsar real-time composition during the pull.
- Increase amplitude and frequency with eased pull progress.
- Apply the same curve in reverse when the pull distance decreases.
- Stop the continuous haptic when progress returns below its start point.
- Keep the existing discrete success or failure haptic after the request ends.

## Reduced motion

- Keep the pull-driven mark state.
- Keep the loading dash static when reduced motion is active.
- Keep the native refresh behavior and status announcements.

## Confidence

- Pull-driven path reveal: high.
- Pull frames 295–330: high.
- Gray loading track and moving dark segment: high.
- Exact source easing and loop duration: medium.
- Haptic curve: user-described adaptation, not visible in the video.
