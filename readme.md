# test-real-styles

utilities to test real styling of (virtual) dom elements

## Installation

```bash
npm install test-real-styles
```

## Usage

Assuming a [jest](https://jestjs.io/) environment executed with
`BROWSERS=chromium,webkit,firefox jest`.

```ts
import withRealStyles, { toCss } from 'test-real-styles';

withRealStyles(
  /* The styles used by the components to be tested */
  `
    button { background-color: fuchsia; }
    button::after {
      border: 2px solid olive;
    }
    button:hover { color: #123456; }
    button:focus { color: rgba(255, 0, 123, 0.5); }
  `,
  /*
   * This function will be called once for each browser in process.env.BROWSERS
   * and never if no browsers given (in order to only execute plain unit tests).
   *
   * In the background it will spin up a headless browser using playwright
   */
  ({ browserName, getStyles, updatePage, hover, focus }) => {
    describe(`button in ${browserName}`, () => {
      it('is pink', async () => {
        /* Note that this can also be a container from https://testing-library.com/ */
        const button = document.createElement('button');

        /* Copy the element over into our real browser */
        await updatePage(button);

        /* Get the styles we're interested in */
        const buttonStyles = await getStyles(button, ['backgroundColor']);

        expect(buttonStyles).toEqual({
          backgroundColor: 'fuchsia',
        });
      });

      it('gets hover styles', async () => {
        const button = document.createElement('button');
        await updatePage(button);

        await hover(button);
        const buttonStyles = await getStyles(button, [
          'color',
          'backgroundColor',
        ]);

        expect(toCss(buttonStyles)).toMatchInlineSnapshot(`
          "color: #123456;
          background-color: fuchsia;"
        `);
      });

      it('gets focus styles', async () => {
        const button = document.createElement('button');
        await updatePage(button);

        await focus(button);
        const buttonStyles = await getStyles(button, ['color']);

        expect(buttonStyles.color).toBe('rgba(255, 0, 123, 0.5)');
      });

      if (browserName !== 'firefox') {
        /* computedStyles of pseudo elements do not work in FF, currently */
        it('gets pseudo elements', async () => {
          const button = document.createElement('button');
          await updatePage(button);

          expect(
            await getStyles(button, ['border'], { pseudoElt: '::after' }),
          ).toEqual({ border: '2px solid olive' });
        });
      }
    });
  },
);
```

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
