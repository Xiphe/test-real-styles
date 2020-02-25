import { render as renderSass } from 'node-sass';
import withRealStyles from './testRealStyles';
import { toCss } from './toCss';

withRealStyles(
  `
    button { background-color: fuchsia; }
    button::after {
      border: 2px solid olive;
    }
    button:hover { color: #123456; }
    button:focus { color: rgba(255, 0, 123, 0.5); }
  `,
  ({ browserName, getStyles, updatePage, hover, focus }) => {
    describe(`button in ${browserName}`, () => {
      it('is pink', async () => {
        const button = document.createElement('button');
        await updatePage(button);

        expect(await getStyles(button, ['backgroundColor'])).toEqual({
          backgroundColor: 'fuchsia',
        });
      });

      it('gets hover styles', async () => {
        const button = document.createElement('button');
        await updatePage(button);

        await hover(button);
        const styles = await getStyles(button, ['color', 'backgroundColor']);

        expect(toCss(styles)).toMatchInlineSnapshot(`
          "color: #123456;
          background-color: fuchsia;"
        `);
      });

      it('gets focus styles', async () => {
        const button = document.createElement('button');
        await updatePage(button);
        await focus(button);

        expect((await getStyles(button, ['color'])).color).toBe(
          'rgba(255, 0, 123, 0.5)',
        );
      });

      if (browserName !== 'firefox') {
        /* computedStyles of pseudo elements do not work in FF, currently */
        it('gets pseudo elements', async () => {
          const button = document.createElement('button');
          await updatePage(button);

          expect(
            await getStyles(button, ['border'], { pseudoElt: '::after' }),
          ).toEqual({ border: '2px solid olive' });
        });
      }
    });
  },
);

describe('with scss', () => {
  withRealStyles(
    new Promise((res, rej) => {
      renderSass(
        { file: __dirname + '/fixtures/style.scss' },
        (err, result) => {
          if (err) {
            rej(err);
            return;
          }
          res(result.css.toString());
        },
      );
    }),
    ({ browserName, getStyles, updatePage }) => {
      it(`h1 is blue in ${browserName} `, async () => {
        const h1 = document.createElement('h1');
        await updatePage(h1);

        expect(await getStyles(h1, ['color'])).toEqual({
          color: '#0055ff',
        });
      });
    },
  );
});
