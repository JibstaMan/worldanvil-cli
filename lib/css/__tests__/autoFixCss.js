const autoFixCss = require('../autoFixCss');

describe('autoFixCss', () => {
  test('should remove the double-quotes from url()', () => {
    const css = `
      .user-css.page {
        background-url("https://www.worldanvil.com/uploads/images/1fea3f76e20423fa5282e0cf246c0b36.jpg");
      }
    `;
    const actual = autoFixCss(css);
    const expected = `
      .user-css.page {
        background-url(https://www.worldanvil.com/uploads/images/1fea3f76e20423fa5282e0cf246c0b36.jpg);
      }
    `;
    expect(actual).toBe(expected);
  });

  test('should remove the single-quotes from url()', () => {
    const css = `
      .user-css.page {
        background-url('https://www.worldanvil.com/uploads/images/1fea3f76e20423fa5282e0cf246c0b36.jpg');
      }
    `;
    const actual = autoFixCss(css);
    const expected = `
      .user-css.page {
        background-url(https://www.worldanvil.com/uploads/images/1fea3f76e20423fa5282e0cf246c0b36.jpg);
      }
    `;
    expect(actual).toBe(expected);
  });

  test('should not mutate url() without quotes', () => {
    const css = `
      .user-css.page {
        background-url(https://www.worldanvil.com/uploads/images/1fea3f76e20423fa5282e0cf246c0b36.jpg);
      }
    `;
    const actual = autoFixCss(css);
    const expected = css;
    expect(actual).toBe(expected);
  });

  test('should not mutate content: ""', () => {
    const css = `
      .user-css.page::after {
        content: "";
        position: fixed;
        bottom: 10px;
        right: 0;
      }
    `;
    const actual = autoFixCss(css);
    const expected = css;
    expect(actual).toBe(expected);
  });
});
