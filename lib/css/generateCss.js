const convertLess = require('./convertLess');
const splitCommaSelectors = require('./splitCommaSelectors');
const autoFixCss = require('./autoFixCss');
const validateCss = require('./validateCss');
const getConfig = require('../util/getConfig');
const readFile = require('../util/readFile');
const writeFile = require('../util/writeFile');
const log = require('../log');

async function generateCss(presentation = true) {
  const entryKey = presentation ? 'presentation' : 'authoringPanel';
  const entry = getConfig(`css.${entryKey}.entry`);

  log.verbose('- Reading entry for LESS');
  let lessFile;
  try {
    lessFile = await readFile(entry);
  }
  catch (e) {
    if (e.code === "ENOENT") {
      const authoringPanelMsg = 'or make it `""` (empty string) to skip it.';
      throw new Error(`Missing file: \`${entry}\` doesn't exist, please update \`css.${entryKey}.entry\` to point to the correct file ${entryKey === 'authoringPanel' ? authoringPanelMsg : '.'}`);
    }
    throw new Error(e);
  }

  log.verbose('- Converting LESS to CSS');
  const css = await convertLess(lessFile);

  log.verbose("- Splitting selectors to remove comma's");
  const noCommaCss = splitCommaSelectors(css);
  const autoFixed = autoFixCss(noCommaCss);

  log.verbose("- Validating CSS on World Anvil's rules");
  const membership = getConfig('membershipTier');
  const error = validateCss(autoFixed, membership);
  if (error) {
    throw new Error(error);
  }

  log.verbose('- Writing CSS output');
  const outputPath = getConfig('css.presentation.output');
  const writtenFilePath = await writeFile(outputPath, autoFixed, 'css');

  log('Updated file: ' + log.c.em(writtenFilePath) + '.');
}

module.exports = generateCss;
