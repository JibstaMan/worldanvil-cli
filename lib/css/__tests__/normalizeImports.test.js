const normalizeImports = require('../normalizeImports');

describe('normalizeImports', () => {
  test('should update relative imports', () => {
    const lessContent = '@import "./vars.less";';
    const filePath = "less/theme.less";

    const actual = normalizeImports(lessContent, filePath);
    const expected = '@import "less/vars.less";';
    expect(actual).toBe(expected);
  });

  test('should treats non-relative imports as relative imports', () => {
    const lessContent = '@import "vars.less";';
    const filePath = "less/theme.less";

    const actual = normalizeImports(lessContent, filePath);
    const expected = '@import "less/vars.less";';
    expect(actual).toBe(expected);
  });

  test('should convert single-quotes to double-quotes', () => {
    const lessContent = "@import './vars.less';";
    const filePath = "less/theme.less";

    const actual = normalizeImports(lessContent, filePath);
    const expected = '@import "less/vars.less";';
    expect(actual).toBe(expected);
  });
});
