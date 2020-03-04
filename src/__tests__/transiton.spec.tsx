import withRealStyles from '../index';

withRealStyles(
  `
  .base {
    border-bottom: 2px solid blue;
    transition: border-color 1s 1s;
  }
  .active {
    border-bottom: 2px solid fuchsia;
  }
  `,
  ({ browserName, getStyles, updatePage }) => {
    describe(`button in ${browserName}`, () => {
      it('gets correct styles after transition', async () => {
        const div = document.createElement('div');
        div.className = 'base active';
        await updatePage(div);

        expect(await getStyles(div, ['borderBottomColor'])).toEqual({
          borderBottomColor: 'fuchsia',
        });
      });
    });
  },
);
