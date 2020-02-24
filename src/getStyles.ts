import { Page } from 'playwright';
import kebabCase from 'lodash.kebabcase';
import { normalize as defaultNormalize } from './normalize';

export type Options = {
  normalize?: (prop: keyof CSSStyleDeclaration, value: string) => string;
  pseudoElt?: string;
};

export async function getStyles<T extends (keyof CSSStyleDeclaration)[]>(
  page: Page,
  selector: string,
  props: T,
  { normalize = defaultNormalize, pseudoElt }: Options,
): Promise<{ [key in T[0]]: string }> {
  const computedStyles = await page.$eval(
    selector,
    (element, styles, pseudoElt) => {
      const computed = window.getComputedStyle(element, pseudoElt);
      return styles.reduce((memo, { key, name }) => {
        memo[name] = computed.getPropertyValue(key);
        return memo;
      }, {} as { [key: string]: string });
    },
    props.map((prop: any) => {
      if (typeof prop !== 'string') {
        throw new Error(`Unexpected prop ${prop} of type ${typeof prop}`);
      }
      return {
        name: prop,
        key: kebabCase(prop).toLowerCase(),
      };
    }),
    pseudoElt,
  );

  return Object.keys(computedStyles).reduce((memo, key) => {
    memo[key] = normalize(key as any, computedStyles[key]);
    return memo;
  }, {} as any);
}
