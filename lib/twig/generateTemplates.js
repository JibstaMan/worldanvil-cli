const path = require('path');
const { parseTwigFunctions } = require('./parseTwigFunctions');
const readTemplateFiles = require('./readTemplateFiles');
const interpolate = require('./interpolate/interpolate');
const getConfig = require('../util/getConfig');
const readFile = require('../util/readFile');
const writeFile = require('../util/writeFile');
const log = require('../log');

async function generateTemplates(templatePath) {
  log.verbose('- Reading entries for Twig functions');
  const twigFuncs = await parseTwigFunctions();

  let twigEntries = [];
  if (!templatePath) {
    log.verbose('- Reading entries for Twig templates');
    twigEntries = await readTemplateFiles();
  }
  else {
    log.verbose(`- Reading ${templatePath} Twig template`);
    const entry = await readFile(templatePath);
    twigEntries = [entry];
  }

  log.verbose('- Checking for function calls within Twig templates');
  const outputTemplates = twigEntries.map(({ content, filePath }) => {
    return { content: interpolate(content, twigFuncs, filePath), filePath };
  });

  log.verbose('- Writing templates output');
  const outputDir = getConfig('twig.outputDir');
  const writtenFiles = await Promise.all(outputTemplates.map(({ content, filePath }) => {
    return writeFile(path.join(outputDir, path.basename(filePath)), content, 'twig');
  }));

  writtenFiles.forEach((writtenFilePath) => {
    log('Updated file: ' + log.c.em(writtenFilePath) + '.');
  });
}

module.exports = generateTemplates;