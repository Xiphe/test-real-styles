import React from 'react';
import { render } from '@testing-library/react';
import Button from './fixtures/Button';
import launch from '../launch';

describe('with react and testing-library', () => {
  const { updatePage, getStyles } = launch('chromium', {
    path: __dirname + '/fixtures/Button.module.css',
  });

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
