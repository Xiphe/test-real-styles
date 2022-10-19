import { compileString } from 'sass';
import fs from 'fs/promises';
import { getRealStyles } from '../index';

const css = new Promise<string>(async (res, rej) => {
  try {
    const { css } = compileString(
      (await fs.readFile(__dirname + '/fixtures/style.scss')).toString(),
    );
    res(css);
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
