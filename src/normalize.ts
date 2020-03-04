import rgbHex from 'rgb-hex';
import namer from 'color-namer';

export function normalize(value: string): string {
  return value
    .replace(/rgb\([0-9, ]+\)/gi, (match) => {
      return `#${rgbHex(match)}`;
    })
    .replace(
      /(#([0-9a-f]{6}|[0-9a-f]{3}))([^0-9a-f]|$)/gi,
      (_, hex, __, delm) => {
        const namedColor = namer(hex).html[0];
        return `${(namedColor.distance === 0
          ? namedColor.name
          : hex
        ).toLowerCase()}${delm}`;
      },
    );
}
