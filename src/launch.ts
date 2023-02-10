import playwright, { Browser, BrowserContext, Page } from 'playwright';
import { resolveStyleInput, Styles } from './resolveStyleInput';
import domToPlaywright from 'dom-to-playwright';
import { getStyles, Options } from './getStyles';
import { withTimeout } from './withTimeout';

if (!(global as any).setImmediate) {
  /** @see https://github.com/microsoft/playwright/issues/18243 */
  (global as any).setImmediate = setTimeout;
}

export const PLAYWRIGHT_BROWSERS = [
  'chromium' as const,
  'firefox' as const,
  'webkit' as const,
];

export type PlaywrightBrowser = (typeof PLAYWRIGHT_BROWSERS)[0];
export interface LaunchedPage {
  name: PlaywrightBrowser;
  getPlaywright(): Promise<{
    browser: Browser;
    context: BrowserContext;
    page: Page;
  }>;
  updatePage(
    element: HTMLElement | Document,
    options?: { transitions?: boolean; styles?: Styles | Promise<Styles> },
  ): Promise<void>;
  getStyles<T extends (keyof CSSStyleDeclaration)[]>(
    element: HTMLElement,
    styles: T,
    options?: Options,
  ): Promise<{ [key in T[0]]: string }>;
  hover(element: HTMLElement): Promise<void>;
  focus(element: HTMLElement): Promise<void>;
}

const cache: { [key: string]: Promise<Browser> } = {};

const DISABLE_TRANSITIONS = `
* {
  -moz-transition: none !important;
  -webkit-transition: none !important;
  transition: none !important;
}`;

export default function launchPage(
  browserName: PlaywrightBrowser,
  stylesInput: Styles | Promise<Styles>,
): LaunchedPage {
  if (!cache[browserName]) {
    cache[browserName] = withTimeout(
      playwright[browserName].launch(),
      `Failed to launch ${browserName} in under %n`,
    );
  }
  const browserP = cache[browserName];
  const contextP = withTimeout(
    browserP.then((b) => b.newContext()),
    `Failed to create context in ${browserName} in under %n`,
  );

  const pageP = withTimeout(
    contextP.then((c) => c.newPage()),
    `Failed to create page in ${browserName} in under %n`,
  );
  const dtpP = pageP.then(domToPlaywright);
  const globalStylesP = withTimeout(
    resolveStyleInput(stylesInput),
    `Failed to global resolve style input for ${browserName} in under %n`,
  );

  return {
    name: browserName,
    async getPlaywright() {
      return {
        browser: await browserP,
        context: await contextP,
        page: await pageP,
      };
    },
    async updatePage(
      element,
      { transitions = false, styles: pageStylesP } = {},
    ) {
      const { update } = await dtpP;
      const page = await pageP;
      const styles = await globalStylesP;

      await withTimeout(
        update(element),
        `Failed to update page within ${browserName} in under %n`,
      );

      await withTimeout(
        page.addStyleTag(styles),
        `Failed to add global styles to page within ${browserName} in under %n`,
      );

      if (pageStylesP) {
        await withTimeout(
          page.addStyleTag(
            await withTimeout(
              resolveStyleInput(pageStylesP),
              `Failed to resolve page style input for ${browserName} in under %n`,
            ),
          ),
          `Failed to add page styles to page within ${browserName} in under %n`,
        );
      }

      if (!transitions) {
        await withTimeout(
          page.addStyleTag({ content: DISABLE_TRANSITIONS }),
          `Failed to disable transitions within ${browserName} in under %n`,
        );
      }
    },
    async getStyles(element, styles, options) {
      const { select } = await dtpP;
      const page = await pageP;

      return withTimeout(
        getStyles(page, select(element), styles, options),
        `Failed to get styles within ${browserName} in under %n`,
      );
    },
    async hover(element) {
      const { select } = await dtpP;
      const page = await pageP;

      await withTimeout(
        page.hover(select(element)),
        `Failed to hover element within ${browserName} in under %n`,
      );
    },
    async focus(element) {
      const { select } = await dtpP;
      const page = await pageP;

      await withTimeout(
        page.focus(select(element)),
        `Failed to focus element within ${browserName} in under %n`,
      );
    },
  };
}

export async function cleanup() {
  const toBeCleared = { ...cache };
  for (const key in cache) {
    delete cache[key];
  }

  for (const key in toBeCleared) {
    const browser = await toBeCleared[key];
    for (const context of browser.contexts()) {
      await context.close();
    }
    await browser.close();
  }
}

if (typeof afterAll === 'function') {
  afterAll(cleanup);
}
