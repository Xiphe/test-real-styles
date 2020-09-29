type Styles = { [key: string]: string };

/* This is executed in the playwright browser
 * Therefore we can not have it instrumented for coverage reports
 * But the effects are covered in the other tests anyways */
/* istanbul ignore next */
export function extractStyles(
  element: Element,
  { styles, pseudoElt }: { styles: Styles[]; pseudoElt?: string },
): Styles {
  const computed = window.getComputedStyle(element, pseudoElt);

  return styles.reduce((memo, { key, name }) => {
    memo[name] = computed.getPropertyValue(key);
    return memo;
  }, {} as Styles);
}
