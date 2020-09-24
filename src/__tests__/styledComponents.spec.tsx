import React from 'react';
import { render } from '@testing-library/react';
import { ServerStyleSheet } from 'styled-components';
import Headline from './fixtures/Headline';
import getRealStyles from '../getRealStyles';

function getCss(sheet: ServerStyleSheet) {
  return sheet
    .getStyleElement()
    .map(({ props }: any) => props.dangerouslySetInnerHTML.__html)
    .join('\n');
}

describe('testing styled components', () => {
  const sheet = new ServerStyleSheet();

  it('works', async () => {
    const { container, getByRole } = render(
      sheet.collectStyles(<Headline>Hello</Headline>),
    );

    const styles = await getRealStyles({
      css: getCss(sheet),
      doc: container,
      element: getByRole('heading'),
      getStyles: ['backgroundColor'],
    });

    expect(styles).toEqual({ backgroundColor: 'fuchsia' });
  });

  it('works with props', async () => {
    const { container, getByRole } = render(
      sheet.collectStyles(<Headline blue>Hello</Headline>),
    );

    const styles = await getRealStyles({
      css: getCss(sheet),
      doc: container,
      element: getByRole('heading'),
      getStyles: ['backgroundColor'],
    });

    expect(styles).toEqual({ backgroundColor: 'blue' });
  });

  it('works with hover', async () => {
    const { container, getByRole } = render(
      sheet.collectStyles(<Headline>Hello</Headline>),
    );

    const styles = await getRealStyles({
      css: getCss(sheet),
      doc: container,
      element: getByRole('heading'),
      hover: getByRole('heading'),
      getStyles: ['backgroundColor'],
    });

    expect(styles).toEqual({ backgroundColor: 'red' });
  });
});
