const splitCommaSelectors = require('../splitCommaSelectors');

describe('splitCommaSelectors', () => {
  test('should split groups of selectors into individual selectors', () => {
    const css = `
.user-css h2,
.user-css h3,
.user-css h4 {
  font-family: var(--fontHeadings);
}`;
    const actual = splitCommaSelectors(css);
    const expected = `
.user-css h2 {
  font-family: var(--fontHeadings);
}
.user-css h3 {
  font-family: var(--fontHeadings);
}
.user-css h4 {
  font-family: var(--fontHeadings);
}`;
    expect(actual).toBe(expected);
  });

  test('should not mutate individual selectors', () => {
    const css = `
.user-css h2 {
  color: var(--colorRed);
}`;
    const actual = splitCommaSelectors(css);
    const expected = css;
    expect(actual).toBe(expected);
  })
});
