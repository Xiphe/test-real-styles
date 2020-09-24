import { PlaywrightBrowser } from 'with-playwright';
import testRealStyles, { Context } from './testRealStyles';
import { Styles } from './resolveStyleInput';
import { Options } from './getStyles';
import { LaunchedPage } from 'with-playwright/dist/getLaunchedPage';

export default function launchStyleBrowser(
  browserName: PlaywrightBrowser,
  styles: Styles | Promise<Styles>,
) {
  const trs = new Promise<[Context, Promise<LaunchedPage>]>((res) => {
    testRealStyles(styles, (context, page) => res([context, page]), [
      browserName,
    ]);
  });
  const context = trs.then(([c]) => c);
  const page = trs.then(([_, p]) => p);

  return {
    async updatePage(element: HTMLElement | Document) {
      return (await context).updatePage(element);
    },
    async getStyles<T extends (keyof CSSStyleDeclaration)[]>(
      element: HTMLElement,
      styles: T,
      options?: Options,
    ) {
      return (await context).getStyles(element, styles, options);
    },
    async hover(element: HTMLElement) {
      return (await context).hover(element);
    },
    async focus(element: HTMLElement) {
      return (await context).focus(element);
    },
    async getPage() {
      return page;
    },
  };
}
