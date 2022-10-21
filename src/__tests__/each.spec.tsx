import { getRealStyles, PLAYWRIGHT_BROWSERS } from '../index';

describe('execution of multiple browsers based on env', () => {
  test.each(PLAYWRIGHT_BROWSERS)('Button in %s', async (browser) => {
    const styles = await getRealStyles({
      browser,
      css: 'button { background-color: fuchsia; }',
      doc: document.createElement('button'),
      getStyles: ['backgroundColor'],
    });

    expect(styles).toEqual({ backgroundColor: 'fuchsia' });
  });
});
