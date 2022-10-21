import { launch, PLAYWRIGHT_BROWSERS } from '../index';

describe('transition styles', () => {
  test.each(PLAYWRIGHT_BROWSERS)(
    'gets correct styles after transition in %s',
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
