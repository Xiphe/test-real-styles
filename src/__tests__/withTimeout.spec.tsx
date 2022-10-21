import { withTimeout } from '../withTimeout';

describe('withTimeout', () => {
  it('fails after a given timeout', async () => {
    await expect(
      withTimeout(new Promise<null>(() => {}), 'timed out after %n', 1),
    ).rejects.toMatchInlineSnapshot(`[Error: timed out after 1ms]`);

    await expect(
      withTimeout(new Promise<null>(() => {}), undefined, 1000),
    ).rejects.toMatchInlineSnapshot(`[Error: Timed out after 1s]`);
  });
});
