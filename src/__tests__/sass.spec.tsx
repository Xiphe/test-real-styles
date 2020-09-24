import { render as renderSass } from 'node-sass';
import { getRealStyles } from '../index';

const css = new Promise<string>((res, rej) => {
  renderSass({ file: __dirname + '/fixtures/style.scss' }, (err, result) => {
    if (err) {
      rej(err);
      return;
    }
    res(result.css.toString());
  });
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
