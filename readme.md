# test-real-styles

utilities to test real styling of (virtual) dom elements

## Installation

```bash
npm install test-real-styles
```

## Usage

```ts
import withRealStyles, { toCss } from 'test-real-styles';

withRealStyles(
  `
    button { background-color: fuchsia; }
    button::after {
      border: 2px solid olive;
    }
    button:hover { color: #123456; }
    button:focus { color: rgba(255, 0, 123, 0.5); }
  `,
  ({ browserName, getStyles, updatePage, hover, focus }) => {
    describe(`button in ${browserName}`, () => {
      it('is pink', async () => {
        /* Not that this can also be a container from https://testing-library.com/ */
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
