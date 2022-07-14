function splitCommaSelectors(css) {
  return css.replace(/([\S\s]*?})/gm, (match) => {
    const rulesOffset = match.indexOf('{');
    const selectors = match.substr(0, rulesOffset).split(',');
    if (selectors.length === 1) {
      return match;
    }

    const rules = match.substr(rulesOffset);
    return selectors.map((selector) => {
      return `\n${selector.trim()} ${rules}`;
    }).join('');
  });
}

module.exports = splitCommaSelectors;