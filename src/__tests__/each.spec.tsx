import getRealStyles from '../getRealStyles';

describe('execution of multiple browsers based on env', () => {
  test.each(['chromium' as const, 'webkit' as const, 'firefox' as const])(
    'Button in %s',
    async (browser) => {
      const styles = await getRealStyles({
        browser,
        css: 'button { background-color: fuchsia; }',
        doc: document.createElement('button'),
        getStyles: ['backgroundColor'],
      });

      expect(styles).toEqual({ backgroundColor: 'fuchsia' });
    },
  );
});
