const generateTemplates = require('../twig/generateTemplates');
const createFileWatcher = require('../util/createFileWatcher');
const getConfig = require('../util/getConfig');
const log = require('../log');

function onFunctionEvent(_, event) {
  if (event !== 'ready') {
    return generateTemplates();
  }
}

function watchFunctions() {
  const functionsGlob = getConfig('twig.functions');

  const functionsWatcher = createFileWatcher(functionsGlob, {}, onFunctionEvent);
  functionsWatcher.on('ready', () => {
    log('Watching template functions in ' + log.c.em(functionsGlob) + '.');
  });
}

function onTemplateEvent(filePath, event) {
  if (event === 'ready') {
    return generateTemplates();
  }
  return generateTemplates(filePath);
}

function watchTemplates() {
  const templatesGlob = getConfig('twig.templates');
  const functionsGlob = getConfig('twig.functions');

  const templatesWatcher = createFileWatcher(
    templatesGlob,
    { ignored: functionsGlob },
    onTemplateEvent,
  );
  templatesWatcher.on('ready', () => {
    log('Watching custom article templates in ' + log.c.em(templatesGlob) + '.');
  });
}

async function watch() {
  watchFunctions();
  watchTemplates();
}

module.exports = watch;
