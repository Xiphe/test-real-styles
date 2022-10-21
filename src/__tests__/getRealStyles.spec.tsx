import { getRealStyles, toCss } from '../index';

const MY_CSS = `
  button {
    background-color: fuchsia;
    border: 2px solid olive;
  }
  button:hover { color: #123456; }
  button:focus { border-color: blue; }
`;

describe('getRealStyle one-line API', () => {
  it('gets styles', async () => {
    // console.log('ONE START_SPEC');
    const styles = await getRealStyles({
      // $$debug: 'ONE',
      css: MY_CSS,
      doc: document.createElement('button'),
      getStyles: ['borderColor'],
    });
    // console.log('ONE GOT STYLES');

    expect(styles).toEqual({ borderColor: 'olive' });
  });

  it('gets styles with all options', async () => {
    // console.log('TWO START_SPEC');
    const myButton = document.createElement('button');
    document.body.appendChild(myButton);

    const styles = await getRealStyles({
      // $$debug: 'TWO',
      browser: 'webkit',
      css: MY_CSS,
      doc: document,
      element: myButton,
      focus: myButton,
      hover: myButton,
      getStyles: ['backgroundColor', 'color', 'borderColor'],
    });

    // console.log('TWO GOT STYLES');

    expect(toCss(styles)).toMatchInlineSnapshot(`
      "background-color: fuchsia;
      color: #123456;
      border-color: blue;"
    `);
  });
});
