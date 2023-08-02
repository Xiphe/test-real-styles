import React from 'react';
import { render } from '@testing-library/react';
import Button from './fixtures/Button';
import { launch } from '../index';

// Emulate css-modules loader for vitest
vi.mock('./fixtures/Button.module.css', () => ({
  default: { button: 'button' },
}));

describe('with react and testing-library', () => {
  it('tests styles', async () => {
    const { updatePage, getStyles } = launch('chromium', {
      path: __dirname + '/fixtures/Button.module.css',
    });

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
