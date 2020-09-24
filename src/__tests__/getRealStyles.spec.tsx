import getRealStyles from '../getRealStyles';
import { toCss } from '../toCss';

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
    const styles = await getRealStyles({
      css: MY_CSS,
      doc: document.createElement('button'),
      getStyles: ['borderColor'],
    });

    expect(styles).toEqual({ borderColor: 'olive' });
  });

  it('gets styles with all options', async () => {
    const myButton = document.createElement('button');
    document.body.appendChild(myButton);

    const styles = await getRealStyles({
      browser: 'webkit',
      css: MY_CSS,
      doc: document,
      element: myButton,
      focus: myButton,
      hover: myButton,
      getStyles: ['backgroundColor', 'color', 'borderColor'],
    });

    expect(toCss(styles)).toMatchInlineSnapshot(`
      "background-color: fuchsia;
      color: #123456;
      border-color: blue;"
    `);
  });
});
