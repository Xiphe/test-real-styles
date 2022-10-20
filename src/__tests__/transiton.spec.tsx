import { launch } from '../index';

describe('transition styles', () => {
  test.each(['chromium' as const, 'webkit' as const, 'firefox' as const])(
    'gets correct styles after transition %s',
    async (browser) => {
      const { updatePage, getStyles } = launch(
        browser,
        `
        .base {
          border-bottom: 2px solid blue;
          transition: border-color 1s 1s;
        }
        .active {
          border-bottom: 2px solid fuchsia;
        }
        `,
      );
      const div = document.createElement('div');
      div.className = 'base active';
      await updatePage(div);

      expect(await getStyles(div, ['borderBottomColor'])).toEqual({
        borderBottomColor: 'fuchsia',
      });
    },
  );
});
