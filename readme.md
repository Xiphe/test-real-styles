# test-real-styles

[![test & release](https://github.com/Xiphe/test-real-styles/actions/workflows/release.yml/badge.svg)](https://github.com/Xiphe/test-real-styles/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/Xiphe/test-real-styles/branch/main/graph/badge.svg?token=LNLZ1IZK6W)](https://codecov.io/gh/Xiphe/test-real-styles)
[![npm](https://img.shields.io/npm/v/test-real-styles)](https://www.npmjs.com/package/test-real-styles)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Love and Peace](http://love-and-peace.github.io/love-and-peace/badges/base/v1.0-small.svg)](https://github.com/love-and-peace/love-and-peace/blob/master/versions/base/v1.0/en.md)

(test-)framework agnostic utilities to test real styling of (virtual) dom elements

## Motivation

I created this with [jest](https://jestjs.io/) and [testing-library](https://testing-library.com/)
in mind to [programmatically test appearance effects of component APIs](https://xiphe.net/blog/testing/component-design-testing.html?rel=test-real-styles)
in [real browsers](https://github.com/microsoft/playwright/).

While [`@testing-library/jest-dom` has a `toHaveStyle` assertion](https://github.com/testing-library/jest-dom#tohavestyle) and there are [ways to test css-in-js](https://github.com/styled-components/jest-styled-components) all solutions I've tried ignore the [css cascade](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
or use a [buggy/incomplete simulation of it](https://github.com/jsdom/jsdom/labels/css).

But real-world components do use the cascade. This library aims to give
you confidence that a style is actually active on an element.

## Installation

```bash
npm install test-real-styles
```

## Usage

Assuming a [NodeJS](https://nodejs.org/en/) test environment with [jsdom](https://github.com/jsdom/jsdom) like [jest](https://jestjs.io/).

```ts
import { getRealStyles, launch, toCss, LaunchedPage } from '../index';

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

    let launchedPage: LaunchedPage | null = null;
    beforeAll(() => {
      launchedPage = launch('webkit', MY_CSS);
    });

    it('gets hover and focus styles', async () => {
      const { updatePage, hover, focus, getStyles } = launchedPage!;
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
      const { updatePage, getStyles } = launchedPage!;
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

- [Using Sass or other pre-processors](https://github.com/Xiphe/test-real-styles/blob/main/src/__tests__/sass.spec.tsx)
- [Using CSS-Modules, React & TestingLibrary](https://github.com/Xiphe/test-real-styles/blob/main/src/__tests__/testingLibraryReact.spec.tsx)
- [Using StyledComponents](https://github.com/Xiphe/test-real-styles/blob/main/src/__tests__/styledComponents.spec.tsx)
- [Run test in multiple browsers parallel](https://github.com/Xiphe/test-real-styles/blob/main/src/__tests__/parallel.spec.tsx)

## License

> The MIT License
>
> Copyright (C) 2022 Hannes Diercks
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
