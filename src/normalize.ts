import rgbHex from 'rgb-hex';
import namer from 'color-namer';

export function normalize(value: string): string {
  const match = value.match(/rgb\(.*\)/);
  if (match) {
    const hex = `#${rgbHex(match[0])}`;
    const namedColor = namer(hex).html[0];
    return value.replace(
      /rgb\(.*\)/,
      namedColor.distance === 0 ? namedColor.name : hex,
    );
  }

  return value;
}
