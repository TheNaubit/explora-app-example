import { Skia } from "@shopify/react-native-skia";

/**
 * GPU dissolve shader.
 * It evaluates particle motion per fragment and avoids per-particle worklet callbacks.
 */
export const PARTICLE_DISSOLVE_SHADER = Skia.RuntimeEffect.Make(`
  uniform shader image;
  uniform float progress;
  uniform float2 origin;
  uniform float2 size;
  uniform float particleSize;
  uniform float2 travel;
  uniform float gravity;
  uniform float scaleLoss;
  uniform float waveSpan;
  uniform float randomStagger;
  uniform float minLifetime;
  uniform float maxLifetime;

  float particleRandom(float2 cell, float salt) {
    return fract(sin(dot(cell + float2(salt, salt * 0.37), float2(12.9898, 78.233))) * 43758.5453);
  }

  float particleProgress(float2 cell) {
    float xFraction = clamp((cell.x + 0.5) * particleSize / size.x, 0.0, 1.0);
    float start = xFraction * waveSpan + particleRandom(cell, 1.0) * randomStagger;
    float lifetime = mix(minLifetime, maxLifetime, particleRandom(cell, 4.0));
    float end = min(1.0, start + lifetime);
    return clamp((progress - start) / max(0.001, end - start), 0.0, 1.0);
  }

  float2 particleOffset(float2 cell, float localProgress) {
    float eased = 1.0 - (1.0 - localProgress) * (1.0 - localProgress);
    float2 direction = float2(
      particleRandom(cell, 2.0) - 0.35,
      particleRandom(cell, 3.0) - 0.65
    );
    return float2(
      direction.x * travel.x * eased,
      direction.y * travel.y * eased + gravity * eased * eased
    );
  }

  half4 main(float2 position) {
    float2 destination = position - origin;
    float2 cell = floor(destination / particleSize);
    float localProgress = particleProgress(cell);
    float2 source = destination - particleOffset(cell, localProgress);

    cell = floor(source / particleSize);
    localProgress = particleProgress(cell);
    source = destination - particleOffset(cell, localProgress);

    if (source.x < 0.0 || source.y < 0.0 || source.x >= size.x || source.y >= size.y) {
      return half4(0.0);
    }

    float scale = max(0.01, 1.0 - localProgress * scaleLoss);
    float2 cellCenter = (floor(source / particleSize) + 0.5) * particleSize;
    float2 scaledSource = cellCenter + (source - cellCenter) / scale;
    half4 color = image.eval(origin + scaledSource);
    return color * half(1.0 - localProgress);
  }
`);
