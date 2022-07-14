const colors = require('colors/safe');

colors.setTheme({
  error: 'red',
  warn: 'yellow',
  debug: 'gray',
  em: 'cyan',
  success: 'green',
  highlight: ['magenta', 'bold'],
});

function logAt(args, level) {
  return args.map((val) => colors[level](val))
}

const log = console.log.bind(console);

log.error = (...args) => console.error(...logAt(args, 'error'));
log.warn = (...args) => console.warn(...logAt(args, 'warn'));
log.success = (...args) => console.warn(...logAt(args, 'success'));

log.c = {};
log.c.error = (message) => colors.error(message);
log.c.warn = (message) => colors.warn(message);
log.c.success = (message) => colors.success(message);
log.c.gray = (message) => colors.debug(message);
log.c.em = (message) => colors.em(message);
log.c.h = (message) => colors.highlight(message);
log.c.b = (message) => colors.bold(message);
log.c.u = (message) => colors.underline(message);

log.printVerbose = false;
log.verbose = function logVerbose(...args) {
  if (log.printVerbose) {
    console.log(...logAt(args, 'debug'));
  }
}

log.options = function logOptions(args, opts) {
  log.verbose(Object.keys(opts).reduce((acc, key) => {
    const val = (typeof args[key] === 'object') ? JSON.stringify(args[key], null, 2) : args[key];
    return acc + `\n${key}: ${val}`;
  }, 'Options:'));
  log.verbose();
}

log.list = function logList(list) {
  if (list.length > 1) {
    const last = list.pop();
    return `${list.join(', ')} and ${last}`;
  }
  if (list.length === 1) {
    return list[0];
  }
  return "";
}

module.exports = log;