const { skipSelectorRootsValidation } = require('../util/featureToggles');

const regex = {
  selector: /^((?!.*\s+\d+%).*?) {$/gm, // explicitly don't capture keyframe percentages
  disallowedChars: /^(.*?(['"<>]).*?)$/m,
  disallowedClassPrefix: /\.(sh|css)/,
}

const validSelectorRoots = [
  ':root',
  '*', // CSS variables
  '@font-face',
  '@keyframes',
  'from',
  'to',
  '.user-css',
  '.user-css-presentation',
  '.user-css-extended',
  '.user-css-secret',
  '.user-css-rpgblock',
  '.user-css-vignette',
  '.map-context-user-css',
  '.world-navigation-palette-trigger',
];

const disallowedWords = [
  'body',
  'container',
  'script',
  'footer',
  'style',
];
const globalDisallowedWords = disallowedWords.filter((word) => word !== 'style');

function validateSelectors(css, membership) {
  let match;
  do {
    match = regex.selector.exec(css);
    if (!match) {
      continue;
    }
    const [selector] = match;
    const hasDisallowedChar = regex.disallowedChars.test(selector);
    if (hasDisallowedChar) {
      return `Invalid selector: \`${selector}\` contains the character \`${RegExp.$2}\`, which will be stripped by the security filter.`;
    }

    if (!skipSelectorRootsValidation(membership)) {
      const hasDisallowedRoot = !validSelectorRoots.find((root) => selector.startsWith(root));
      if (hasDisallowedRoot) {
        return `Invalid selector: \`${selector}\` doesn't match any of the allowed root selectors.`
      }
    }

    const disallowedWord = disallowedWords.find((disallowedWord) => selector.includes(disallowedWord))
    if (disallowedWord) {
      return `Invalid selector: \`${selector}\` has the word "${disallowedWord}" in it, which will be stripped by the security filter.`;
    }

    const hasDisallowedClassPrefix = regex.disallowedClassPrefix.test(selector);
    if (hasDisallowedClassPrefix) {
      return `Invalid selector: \`${selector}\` includes a class that begins with "sh" or "css", which will be stripped by the security filter.`;
    }
  }
  while (match);
}

function validateCss(css, membership) {
  const error = validateSelectors(css, membership);
  if (error) {
    return error;
  }

  const hasDisallowedChar = regex.disallowedChars.test(css);
  if (hasDisallowedChar) {
    return `Invalid character found: \`${RegExp.$1}\` contains the character \`${RegExp.$2}\`, which will be stripped by the security filter.`;
  }

  const disallowedWord = globalDisallowedWords.find((disallowedWord) => css.includes(disallowedWord))
  if (disallowedWord) {
    return `Invalid word found: the css contains the word "${disallowedWord}", which will be stripped by the security filter.`;
  }

  return "";
}

module.exports = validateCss;
