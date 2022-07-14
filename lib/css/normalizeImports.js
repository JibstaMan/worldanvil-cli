const path = require('path');

const importRegex = /@import ['"]\.?\/?(.*?)['"]/gm;

/**
 * LESS wants relative paths relative to process.cwd(). This function normalizes
 * imports that are relative to the respective file, so LESS can process them.
 *
 * This won't fix imports within imported files though, that's out of scope.
 *
 * @param lessContent The LESS content
 * @param filePath The path to the LESS file
 * @returns {string} The LESS content with import statements normalized.
 */
function normalizeImports(lessContent, filePath) {
  const relativePath = path.dirname(filePath);
  return lessContent.replace(importRegex, (match, fileName) => {
    return `@import "${relativePath}/${fileName}"`;
  });
}

module.exports = normalizeImports;
