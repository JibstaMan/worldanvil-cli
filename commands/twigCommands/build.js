const runSafeCommand = require('../../lib/util/runSafeCommand');
const generateTemplates = require('../../lib/twig/generateTemplates');
const { maybeCheckForUpdates } = require('../../lib/util/checkForUpdates');
const log = require('../../lib/log');

exports.command = 'build';

exports.describe = 'Build Twig templates from the source files';

exports.builder = async function (yargs) {
  return {};
}

async function build(argv) {
  // log();
  // log.options(argv, opts);
  await maybeCheckForUpdates();

  await generateTemplates();

  log();
  log('DONE');
}

exports.handler = async function buildCommand(argv) {
  await runSafeCommand(build, argv);
}
