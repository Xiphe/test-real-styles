import { getRealStyles, launch, toCss } from '../index';

const MY_CSS = `
  button { background-color: fuchsia; }
  button::after {
    border: 2px solid olive;
  }
  button:hover { color: #123456; }
  button:focus { color: rgba(255, 0, 123, 0.5); }
`;

describe(`button`, () => {
  it('is pink', async () => {
    /**
     * This will
     * - launch a headless chromium
     * - insert the css
     * - update the page with `doc`
     * - return getComputedStyle(doc)['backgroundColor']
     */
    const styles = await getRealStyles({
      css: MY_CSS,
      doc: document.createElement('button'),
      getStyles: ['backgroundColor'],
    });

    expect(styles).toEqual({ backgroundColor: 'fuchsia' });
  });

  describe('launch API', () => {
    /* In case you want to re-use the browser, interact with the page or do stuff
       before styles are returned */
    const { updatePage, getStyles, hover, focus } = launch('webkit', MY_CSS);

    it('gets hover and focus styles', async () => {
      const button = document.createElement('button');
      await updatePage(button);

      await hover(button);
      const hoverStyles = await getStyles(button, ['color', 'backgroundColor']);
      await focus(button);
      const focusStyles = await getStyles(button, ['color']);

      expect(toCss(hoverStyles)).toMatchInlineSnapshot(`
        "color: #123456;
        background-color: fuchsia;"
      `);
      expect(focusStyles.color).toBe('rgba(255, 0, 123, 0.5)');
    });

    it('gets pseudo elements', async () => {
      const button = document.createElement('button');
      await updatePage(button);

      expect(
        await getStyles(button, ['border'], { pseudoElt: '::after' }),
      ).toEqual({ border: '2px solid olive' });
    });
  });
});
