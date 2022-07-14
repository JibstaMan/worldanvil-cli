exports.command = 'css';

exports.describe = 'Run build or watch commands for CSS only';

exports.builder = function (yargs) {
  return yargs.commandDir('cssCommands');
}

exports.handler = function (argv) {
  // handled by commandDir
}