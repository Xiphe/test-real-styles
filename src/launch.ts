import playwright, { Browser } from 'playwright';
import { resolveStyleInput, Styles } from './resolveStyleInput';
import domToPlaywright from 'dom-to-playwright';
import { getStyles, Options } from './getStyles';
import { withTimeout } from './withTimeout';

export const PLAYWRIGHT_BROWSERS = [
  'chromium' as const,
  'firefox' as const,
  'webkit' as const,
];

export type PlaywrightBrowser = typeof PLAYWRIGHT_BROWSERS[0];

const cache: { [key: string]: Promise<Browser> } = {};

const DISABLE_TRANSITIONS = `
* {
  -moz-transition: none !important;
  -webkit-transition: none !important;
  transition: none !important;
}`;

export default function launchStyleBrowser(
  browserName: PlaywrightBrowser,
  stylesInput: Styles | Promise<Styles>,
) {
  if (!cache[browserName]) {
    cache[browserName] = withTimeout(
      playwright[browserName].launch(),
      `Failed to launch ${browserName} in under %n.\nTry reducing parallel test runs`,
    );
  }
  const browserP = cache[browserName];
  const contextP = withTimeout(
    browserP.then((b) => b.newContext()),
    `Failed to create context in ${browserName} in under %n.\nTry reducing parallel test runs`,
  );

  const pageP = withTimeout(
    contextP.then((c) => c.newPage()),
    `Failed to create page in ${browserName} in under %n.\nTry reducing parallel test runs`,
  );
  const dtpP = pageP.then(domToPlaywright);
  const stylesP = withTimeout(
    resolveStyleInput(stylesInput),
    'Failed to resolve style input in under %n',
  );

  return {
    name: browserName,
    browser: browserP,
    context: contextP,
    page: pageP,
    async updatePage(
      element: HTMLElement | Document,
      { transitions = false }: { transitions?: boolean } = {},
    ) {
      const { update } = await dtpP;
      const page = await pageP;
      const styles = await stylesP;

      await withTimeout(
        update(element),
        'Failed to update page in under %n.\nTry reducing parallel test runs',
      );

      await withTimeout(
        page.addStyleTag(styles),
        'Failed to add styles to page in under %n.\nTry reducing parallel test runs',
      );

      if (!transitions) {
        await withTimeout(
          page.addStyleTag({ content: DISABLE_TRANSITIONS }),
          'Failed to disable transitions in under %n.\nTry reducing parallel test runs',
        );
      }
    },
    async getStyles<T extends (keyof CSSStyleDeclaration)[]>(
      element: HTMLElement,
      styles: T,
      options?: Options,
    ) {
      const { select } = await dtpP;
      const page = await pageP;

      return withTimeout(
        getStyles(page, select(element), styles, options),
        'Failed to get styles in under %n.\nTry reducing parallel test runs',
      );
    },
    async hover(element: HTMLElement) {
      const { select } = await dtpP;
      const page = await pageP;

      await withTimeout(
        page.hover(select(element)),
        'Failed to hover element in under %n.\nTry reducing parallel test runs',
      );
    },
    async focus(element: HTMLElement) {
      const { select } = await dtpP;
      const page = await pageP;

      await withTimeout(
        page.focus(select(element)),
        'Failed to focus element in under %n.\nTry reducing parallel test runs',
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
