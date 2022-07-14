exports.command = 'twig';

exports.describe = 'Run build or watch commands for Twig templates only';

exports.builder = function (yargs) {
  return yargs.commandDir('twigCommands');
}

exports.handler = function (argv) {
  // handled by commandDir
}