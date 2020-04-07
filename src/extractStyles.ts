type Styles = { [key: string]: string };

/* This is executed in the browser */
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
