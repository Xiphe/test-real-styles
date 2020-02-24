import kebabCase from 'lodash.kebabcase';

export function toCss(style: { [key: string]: string }): string {
  return Object.keys(style)
    .map((key) => `${kebabCase(key).toLowerCase()}: ${style[key]};`)
    .join('\n');
}
