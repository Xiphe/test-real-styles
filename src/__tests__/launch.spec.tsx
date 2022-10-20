import launch from '../launch';
import { toCss } from '../toCss';

const MY_CSS = `
button { background-color: fuchsia; }
button::after {
  border: 2px solid olive;
}
button:hover { color: #123456; }
button:focus { color: rgba(255, 0, 123, 0.5); }
`;

describe('button with launch API', () => {
  const { updatePage, getStyles, hover, focus, close } = launch(
    'chromium',
    MY_CSS,
  );
  afterAll(close);

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

  /* computedStyles of pseudo elements do not work in FF, currently */
  it('gets pseudo elements', async () => {
    const button = document.createElement('button');
    await updatePage(button);

    expect(
      await getStyles(button, ['border'], { pseudoElt: '::after' }),
    ).toEqual({ border: '2px solid olive' });
  });
});
