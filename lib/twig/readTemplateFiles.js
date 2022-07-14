const glob = require('glob');
const readFile = require('../util/readFile');
const getConfig = require('../util/getConfig');
const log = require('../log');

async function readTemplateFiles(templates = true) {
  const templatesGlob = getConfig(`twig.templates`);
  const functionsGlob = getConfig(`twig.functions`);

  const findGlob = templates ? templatesGlob : functionsGlob;
  const ignoreGlob = templates ? functionsGlob : undefined;

  const files = glob.sync(findGlob, {
    ignore: ignoreGlob,
  });

  const filesName = templates ? 'Templates' : 'Template functions';
  const ignoreMsg = (ignoreGlob) ? ` (while ignoring \`${ignoreGlob}\`)` : '';
  if (!files.length) {
    throw new Error(`No ${filesName.toLowerCase()} found for \`${findGlob}\`${ignoreMsg}.`);
  }
  else {
    log.verbose(`${filesName} found for \`${findGlob}\`${ignoreMsg}:`);
    log.verbose(files);
  }

  return Promise.all(files.map((filePath) => readFile(filePath)));
}

module.exports = readTemplateFiles;