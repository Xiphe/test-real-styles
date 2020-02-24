import withPlayWright, { LaunchedPage } from 'with-playwright';
import domToPlaywright from 'dom-to-playwright';
import { getStyles, Options } from './getStyles';

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

export default function testRealStyles(styles: string, callback: Callback) {
  withPlayWright((browserName, pw) => {
    let asyncStuff = pw.then(async ({ page }) => {
      const res = await domToPlaywright(page);
      return {
        ...res,
        page,
      };
    });

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
          const { update, page } = await asyncStuff;
          await update(node);
          await page.addStyleTag({ content: styles });
        },
      },
      pw,
    );
  });
}
