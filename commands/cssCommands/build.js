const runSafeCommand = require('../../lib/util/runSafeCommand');
const generateCss = require('../../lib/css/generateCss');
const { maybeCheckForUpdates } = require('../../lib/util/checkForUpdates');
const getConfig = require('../../lib/util/getConfig');
const log = require('../../lib/log');

exports.command = 'build';

exports.describe = 'Build LESS theme from the source files';

exports.builder = async function (yargs) {
  return {};
}

async function build(argv) {
  // log();
  // log.options(argv, opts);

  await maybeCheckForUpdates();

  await generateCss();
  const authoringPanelEntry = getConfig('css.authoringPanel.entry', false);
  if (!!authoringPanelEntry) {
    await generateCss(false);
  }

  log();
  log('DONE');
}

exports.handler = async function buildCommand(argv) {
  await runSafeCommand(build, argv);
}
