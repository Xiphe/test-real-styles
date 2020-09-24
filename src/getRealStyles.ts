import { PlaywrightBrowser } from 'with-playwright';
import { Styles } from './resolveStyleInput';
import { Options as GetStyleOptions } from './getStyles';
import launchStyleBrowser from './launch';

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
   * the browser to test the styles in
   */
  browser?: PlaywrightBrowser;
};

function isDocument(elm: HTMLElement | Document): elm is Document {
  return Boolean((elm as any).body);
}

function getElement(elm: HTMLElement | Document) {
  return isDocument(elm) ? elm.body : elm;
}

export default async function getRealStyles<
  T extends (keyof CSSStyleDeclaration)[]
>({
  browser = 'chromium',
  css,
  doc,
  element = getElement(doc),
  hover,
  focus,
  getStyles,
  options,
}: Options<T>): Promise<{ [key in T[0]]: string }> {
  const sb = launchStyleBrowser(browser, css);

  await sb.updatePage(doc);

  if (focus) {
    await sb.focus(focus);
  }
  if (hover) {
    await sb.hover(hover);
  }

  return sb.getStyles(element, getStyles, options);
}
