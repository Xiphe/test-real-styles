import { getBrowsers } from 'with-playwright';
import getRealStyles from '../getRealStyles';

describe('parallel execution of multiple browsers based on env', () => {
  let check: string[] = [];

  test.concurrent.each(getBrowsers(process.env))(
    'Button in %s',
    async (browser) => {
      const styles = await getRealStyles({
        browser,
        css: 'button { background-color: fuchsia; }',
        doc: document.createElement('button'),
        getStyles: ['backgroundColor'],
      });

      expect(styles).toEqual({ backgroundColor: 'fuchsia' });
      check.push(browser);
    },
  );

  /* This is just a sanity check, no need to do that for your tests */
  /* prefer directly passing ['chromium', 'webkit', 'firefox'] to test.concurrent.each */
  it('executed three tests', () => {
    expect(check).toHaveLength(3);
    expect(check).toContain('chromium');
    expect(check).toContain('firefox');
    expect(check).toContain('webkit');
  });
});
