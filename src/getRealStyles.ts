import { Styles } from './resolveStyleInput';
import { Options as GetStyleOptions } from './getStyles';
import launchStyleBrowser, { PlaywrightBrowser } from './launch';

type Options<S> = {
  /**
   * the styles to be applied to the doc
   */
  css: Styles | Promise<Styles>;
  /**
   * The base document or html element that should be tested
   */
  doc: HTMLElement | Document;
  /**
   * The style declarations that we're interested in
   */
  getStyles: S;
  /**
   * Options for style-extraction
   */
  options?: GetStyleOptions;
  /**
   * The element of which the styles should be returned
   * @default {doc}
   */
  element?: HTMLElement;
  /**
   * An optional element that should be hovered
   */
  hover?: HTMLElement;
  /**
   * An optional element that should be focussed
   */
  focus?: HTMLElement;
  /**
   * The browser to test the styles in
   */
  browser?: PlaywrightBrowser;
  /**
   * CSS transitions are disabled by default, set true to enable them
   */
  transitions?: boolean;
};

function isDocument(elm: HTMLElement | Document): elm is Document {
  return Boolean((elm as any).body);
}

function getElement(elm: HTMLElement | Document) {
  return isDocument(elm) ? elm.body : elm;
}

export default async function getRealStyles<
  T extends (keyof CSSStyleDeclaration)[],
>({
  browser = 'chromium',
  css,
  doc,
  element = getElement(doc),
  hover,
  focus,
  getStyles,
  transitions,
  options,
}: Options<T>): Promise<{ [key in T[0]]: string }> {
  const sb = launchStyleBrowser(browser, css);

  await sb.updatePage(doc, { transitions });

  if (focus) {
    await sb.focus(focus);
  }
  if (hover) {
    await sb.hover(hover);
  }

  const styles = await sb.getStyles(element, getStyles, options);

  (await sb.page).close();
  (await sb.context).close();

  return styles;
}
