/**
 * Converts HSL color values to hex format
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns Hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Gets a color from the rainbow spectrum based on position
 * @param position Position from 0 to 1 (0 = red/oldest, 1 = violet/newest)
 * @returns Hex color string
 */
export function getRainbowColor(position: number): string {
  // Clamp position between 0 and 1
  const clampedPosition = Math.max(0, Math.min(1, position));

  // Map position to hue: 0° (red) to 270° (violet)
  // We go forwards through the spectrum: red -> orange -> yellow -> green -> cyan -> blue -> violet
  const hue = clampedPosition * 270;

  return hslToHex(hue, 100, 50);
}
