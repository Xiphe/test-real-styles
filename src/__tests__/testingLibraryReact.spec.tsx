import React from 'react';
import { render } from '@testing-library/react';
import Button from './fixtures/Button';
import { launch } from '../index';

describe('with react and testing-library', () => {
  const { updatePage, getStyles, close } = launch('chromium', {
    path: __dirname + '/fixtures/Button.module.css',
  });

  afterAll(close);

  it('tests styles', async () => {
    const { container, getByRole } = render(
      <div>
        <Button>Hello</Button>
      </div>,
    );

    await updatePage(container);

    expect(
      (await getStyles(getByRole('button'), ['backgroundColor']))
        .backgroundColor,
    ).toBe('fuchsia');
  });
});
