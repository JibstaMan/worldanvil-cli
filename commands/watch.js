const watchCss = require('../lib/css/watch');
const watchTwig = require('../lib/twig/watch');
const runSafeCommand = require('../lib/util/runSafeCommand');
const { maybeCheckForUpdates } = require('../lib/util/checkForUpdates');
const getConfig = require('../lib/util/getConfig');
const log = require('../lib/log');

exports.command = 'watch';

exports.describe = 'Watch for changes in the LESS files to rebuild on save';

exports.builder = async function (yargs) {
  return {};
}

async function watch() {
  await maybeCheckForUpdates();

  const cssEnabled = getConfig('css.enabled', false, true);
  const twigEnabled = getConfig('twig.enabled', false, true);

  if (!cssEnabled && !twigEnabled) {
    log.error("You've disabled both CSS and Twig templates options, so this command won't do anything");
    process.exit(0);
  }

  if (cssEnabled) {
    await watchCss();
  }
  else {
    log();
    log.verbose('Watching the CSS was disabled');
  }
  if (twigEnabled) {
    await watchTwig();
  }
  else {
    log();
    log.verbose('Watching the Twig templates was disabled');
  }
}

exports.handler = async function watchCommand(argv) {
  await runSafeCommand(watch, argv);
}