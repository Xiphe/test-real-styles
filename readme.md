# test-real-styles

utilities to test real styling of (virtual) dom elements

## Installation

```bash
npm install test-real-styles
```

## Usage

Assuming a [NodeJS](https://nodejs.org/en/) test environment with [jsdom](https://github.com/jsdom/jsdom) like [jest](https://jestjs.io/).

```ts
import { getRealStyles, launch, toCss } from 'test-real-styles';

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
```

## Examples

- [Using Sass or other pre-processors](https://github.com/Xiphe/test-real-styles/blob/trunk/src/__tests__/sass.spec.tsx)
- [Using React + TestingLibrary](https://github.com/Xiphe/test-real-styles/blob/trunk/src/__tests__/testingLibraryReact.spec.tsx)

## License

> The MIT License
>
> Copyright (C) 2020 Hannes Diercks
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
