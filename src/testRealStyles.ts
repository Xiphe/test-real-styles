import withPlayWright, { LaunchedPage } from 'with-playwright';
import domToPlaywright from 'dom-to-playwright';
import { getStyles, Options } from './getStyles';
import { resolveStyleInput, Styles } from './resolveStyleInput';

type Callback = (
  context: {
    browserName: string;
    getStyles: <T extends (keyof CSSStyleDeclaration)[]>(
      element: HTMLElement,
      styles: T,
      options?: Options,
    ) => Promise<{ [key in T[0]]: string }>;
    hover: (element: HTMLElement) => Promise<void>;
    focus: (element: HTMLElement) => Promise<void>;
    updatePage: (node: HTMLElement | Document) => Promise<void>;
  },
  launchedPage: Promise<LaunchedPage>,
) => void;

export default function testRealStyles(
  styles: Styles | Promise<Styles>,
  callback: Callback,
) {
  withPlayWright((browserName, pw) => {
    const asyncStuff = pw.then(async ({ page }) => ({
      ...(await domToPlaywright(page)),
      styles: await resolveStyleInput(styles),
      page,
    }));

    callback(
      {
        browserName,
        async getStyles(element, props, options = {}) {
          const { select, page } = await asyncStuff;
          return getStyles(page, select(element), props, options);
        },
        async focus(element) {
          const { select, page } = await asyncStuff;
          await page.focus(select(element));
        },
        async hover(element) {
          const { select, page } = await asyncStuff;
          await page.hover(select(element));
        },
        async updatePage(node) {
          const { update, page, styles } = await asyncStuff;
          await update(node);
          await page.addStyleTag(styles);
        },
      },
      pw,
    );
  });
}
