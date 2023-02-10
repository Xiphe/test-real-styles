import { launch, toCss, LaunchedPage } from '../index';

const MY_CSS = `
button { background-color: fuchsia; }
button::after {
  border: 2px solid olive;
}
button:hover { color: #123456; }
button:focus { color: rgba(255, 0, 123, 0.5); }
`;

describe('button with launch API', () => {
  let launchedPage: LaunchedPage | null = null;
  beforeAll(() => {
    launchedPage = launch('chromium', MY_CSS);
  });

  it('accepts custom styles when updating page', async () => {
    const { updatePage, getStyles } = launchedPage!;
    const button = document.createElement('button');
    await updatePage(button, {
      styles: `button { background-color: black !important; }`,
    });

    expect(await getStyles(button, ['backgroundColor'])).toEqual({
      backgroundColor: 'black',
    });
  });

  it('is pink', async () => {
    const { updatePage, getStyles } = launchedPage!;
    const button = document.createElement('button');
    await updatePage(button);

    expect(await getStyles(button, ['backgroundColor'])).toEqual({
      backgroundColor: 'fuchsia',
    });
  });

  it('gets hover styles', async () => {
    const { updatePage, getStyles, hover } = launchedPage!;
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
    const { updatePage, getStyles, focus } = launchedPage!;
    const button = document.createElement('button');
    await updatePage(button);
    await focus(button);

    expect((await getStyles(button, ['color'])).color).toBe(
      'rgba(255, 0, 123, 0.5)',
    );
  });

  /* computedStyles of pseudo elements do not work in FF, currently */
  it('gets pseudo elements', async () => {
    const { updatePage, getStyles } = launchedPage!;
    const button = document.createElement('button');
    await updatePage(button);

    expect(
      await getStyles(button, ['border'], { pseudoElt: '::after' }),
    ).toEqual({ border: '2px solid olive' });
  });
});
