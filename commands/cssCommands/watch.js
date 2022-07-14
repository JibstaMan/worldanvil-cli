const watchCss = require('../../lib/css/watch');
const runSafeCommand = require('../../lib/util/runSafeCommand');
const { maybeCheckForUpdates } = require('../../lib/util/checkForUpdates');

exports.command = 'watch';

exports.describe = 'Watch for changes in the LESS files to rebuild on save';

exports.builder = async function (yargs) {
  return {};
}

async function watch(argv) {
  await maybeCheckForUpdates();
  await watchCss();
}

exports.handler = async function watchCommand(argv) {
  await runSafeCommand(watch, argv);
}