import rgbHex from 'rgb-hex';
import namer from 'color-namer';

export function normalize(value: string): string {
  const rgbMatch = value.match(/rgb\(.*\)/);
  if (rgbMatch) {
    value = value.replace(/rgb\(.*\)/, `#${rgbHex(rgbMatch[0])}`);
  }
  const hexMatch = value.match(/(#[0-9a-f]{6})/i);
  if (hexMatch) {
    const namedColor = namer(hexMatch[0]).html[0];
    return value.replace(
      /(#[0-9a-f]{6})/i,
      (namedColor.distance === 0 ? namedColor.name : hexMatch[0]).toLowerCase(),
    );
  }

  return value;
}
