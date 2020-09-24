import withPlayWright, {
  LaunchedPage,
  PlaywrightBrowser,
} from 'with-playwright';
import domToPlaywright from 'dom-to-playwright';
import { getStyles, Options } from './getStyles';
import { resolveStyleInput, Styles } from './resolveStyleInput';

export type Context = {
  browserName: string;
  getStyles: <T extends (keyof CSSStyleDeclaration)[]>(
    element: HTMLElement,
    styles: T,
    options?: Options,
  ) => Promise<{ [key in T[0]]: string }>;
  hover: (element: HTMLElement) => Promise<void>;
  focus: (element: HTMLElement) => Promise<void>;
  updatePage: (
    node: HTMLElement | Document,
    options?: { transitions?: boolean },
  ) => Promise<void>;
};

type Callback = (context: Context, launchedPage: Promise<LaunchedPage>) => void;

const DISABLE_TRANSITIONS = `
* {
  -moz-transition: none !important;
  -webkit-transition: none !important;
  transition: none !important;
}`;

/** @deprecated in favour of new launch API */
export default function testRealStyles(
  styles: Styles | Promise<Styles>,
  callback: Callback,
  browsers?: PlaywrightBrowser[],
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
        async updatePage(node, options = {}) {
          const { transitions = false } = options;
          const { update, page, styles } = await asyncStuff;
          await update(node);
          await page.addStyleTag(styles);
          if (!transitions) {
            await page.addStyleTag({ content: DISABLE_TRANSITIONS });
          }
        },
      },
      pw,
    );
  }, browsers);
}
