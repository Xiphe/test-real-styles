import { Page } from 'playwright';
import kebabCase from 'lodash.kebabcase';
import { normalize as defaultNormalize } from './normalize';
import { extractStyles } from './extractStyles';

export type Options = {
  normalize?: (value: string, prop: keyof CSSStyleDeclaration) => string;
  pseudoElt?: string;
};

export async function getStyles<T extends (keyof CSSStyleDeclaration)[]>(
  page: Page,
  selector: string,
  props: T,
  { normalize = defaultNormalize, pseudoElt }: Options,
): Promise<{ [key in T[0]]: string }> {
  const styles = props.map((prop: any) => {
    if (typeof prop !== 'string') {
      throw new Error(`Unexpected prop ${prop} of type ${typeof prop}`);
    }
    return {
      name: prop,
      key: kebabCase(prop).toLowerCase(),
    };
  });

  const computedStyles = await page.$eval(selector, extractStyles, {
    styles,
    pseudoElt,
  });

  return Object.keys(computedStyles).reduce((memo, key) => {
    memo[key] = normalize(computedStyles[key], key as any);
    return memo;
  }, {} as any);
}
