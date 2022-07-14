const path = require('path');
const generateCss = require('./generateCss');
const createFileWatcher = require('../util/createFileWatcher');
const getConfig = require('../util/getConfig');
const log = require('../log');

async function generateAllCss(hasAuthoringPanel) {
  await generateCss();
  if (hasAuthoringPanel) {
    await generateCss(false);
  }
}

async function watch() {
  const presentationEntry = getConfig('css.presentation.entry');
  const authoringPanelEntry = getConfig('css.authoringPanel.entry', false);
  const hasAuthoringPanel = !!authoringPanelEntry;

  const presentationDirname = path.dirname(presentationEntry);
  const authoringPanelDirname = hasAuthoringPanel ? path.dirname(authoringPanelEntry) : '';

  let lessGlob = `${presentationDirname}/**/*.less`;
  if (hasAuthoringPanel && presentationDirname !== authoringPanelDirname) {
    lessGlob = `@(${presentationDirname}|${authoringPanelDirname})/**/*.less`
  }

  const lessWatcher = createFileWatcher(lessGlob, {}, () => generateAllCss(hasAuthoringPanel));
  lessWatcher.on('ready', () => {
    let startupMsg = 'Watching `.less` files in ' + log.c.em(presentationDirname);
    if (hasAuthoringPanel && presentationDirname !== authoringPanelDirname) {
      startupMsg += ' and ' + log.c.em(authoringPanelDirname) + ' folders.'
    }
    else {
      startupMsg += ' folder.';
    }
    log(startupMsg);
  });
}

module.exports = watch;
