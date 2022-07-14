const runSafeCommand = require('../lib/util/runSafeCommand');
const generateCss = require('../lib/css/generateCss');
const generateTemplates = require('../lib/twig/generateTemplates');
const { maybeCheckForUpdates } = require('../lib/util/checkForUpdates');
const getConfig = require('../lib/util/getConfig');
const log = require('../lib/log');

exports.command = 'build';

exports.describe = 'Build Twig templates from the source files';

exports.builder = async function (yargs) {
  return {};
}

async function build() {
  await maybeCheckForUpdates();

  const cssEnabled = getConfig('css.enabled', false, true);
  const twigEnabled = getConfig('twig.enabled', false, true);

  if (!cssEnabled && !twigEnabled) {
    log.error("You've disabled both CSS and Twig templates options, so this command won't do anything");
    process.exit(0);
  }

  if (cssEnabled) {
    await generateCss();
    const authoringPanelEntry = getConfig('css.authoringPanel.entry', false);
    if (!!authoringPanelEntry) {
      await generateCss(false);
    }
  }
  else {
    log();
    log.verbose('Building the CSS was disabled');
  }

  if (twigEnabled) {
    await generateTemplates();
  }
  else {
    log();
    log.verbose('Building the Twig templates was disabled');
  }

  log();
  log('DONE');
}

exports.handler = async function buildCommand(argv) {
  await runSafeCommand(build, argv);
}
