const path = require('path');
const less  = require('less');
const CleanCSS = require('clean-css');
const normalizeImports = require('./normalizeImports');
const getConfig = require('../util/getConfig');

async function convertLess(lessFile) {
  const { content: lessContent, filePath } = lessFile;

  const lessImportNormalized = normalizeImports(lessContent, filePath);

  const lessOptions = getConfig('css.lessOptions');
  const output = await less.render(lessImportNormalized, {
    paths: [path.dirname(filePath)],
    ...lessOptions
  });
  console.log('paths:', [path.dirname(filePath)]);

  // https://github.com/clean-css/clean-css#constructor-options
  const cleanedCss = new CleanCSS({
    format: 'beautify',
  }).minify(output.css);

  return cleanedCss.styles;
}

module.exports = convertLess;