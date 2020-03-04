import { normalizeValue } from '../index';

describe('normalize', () => {
  it('converts hex to named color', () => {
    expect(normalizeValue('#ff00ff')).toBe('fuchsia');
  });

  it('converts rgb to hex', () => {
    expect(normalizeValue('rgb(1,2,3)')).toBe('#010203');
  });

  it('converts rgb to named color', () => {
    expect(normalizeValue('rgb(255,0,255)')).toBe('fuchsia');
  });

  it('leaves hex intact when no exact color can be found', () => {
    expect(normalizeValue('#010203')).toBe('#010203');
  });

  it('converts only the color part', () => {
    expect(normalizeValue('1px solid #00ff00')).toBe('1px solid lime');
  });

  it('converts multiple color values (border-color)', () => {
    expect(
      normalizeValue('#00ff00 rgb(0, 255, 0) rgb(255, 0, 0) #ff0000'),
    ).toBe('lime lime red red');
  });

  it('converts short hex', () => {
    expect(normalizeValue('#000, #00f')).toBe('black, blue');
  });
});
