import { render as renderSass } from 'node-sass';
import withRealStyles from '../index';

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
