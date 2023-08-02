import { getRealStyles } from '../index';
import { exec } from 'child_process';
import { promisify } from 'util';

const css = new Promise<string>(async (res, rej) => {
  try {
    /** Technically, this should also be possible with the JS API of sass
     * but for some reason I wasn't able to get it to work with vitest */
    const css = await promisify(exec)(
      'npx sass ' + __dirname + '/fixtures/style.scss',
    );
    res(css.stdout);
  } catch (err) {
    rej(err);
  }
});

describe('with scss', () => {
  it(`h1 is blue`, async () => {
    expect(
      await getRealStyles({
        css,
        doc: document.createElement('h1'),
        getStyles: ['color'],
      }),
    ).toEqual({
      color: '#0055ff',
    });
  });
});
