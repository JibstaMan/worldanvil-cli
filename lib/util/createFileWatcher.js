const path = require('path');
const chokidar = require('chokidar');
const log = require('../log');

const EVENT_MAP = {
  change: 'changed',
  add: 'created',
  unlink: 'removed',
  addDir: 'created',
  unlinkDir: 'removed',
};

async function safeCallCallback(cb, ...args) {
  try {
    await cb(...args);
  } catch (e) {
    log.error(e.message);
    log.verbose(e.stack);
  }
}

function createFileWatcher(files, options, cb) {
  const fileWatcher = chokidar.watch(files, {
    ignoreInitial: true,
    awaitWriteFinish: true,
    ...options,
  });

  fileWatcher
    .on('all', (event, filePath) => {
      if (EVENT_MAP[event]) {
        log();
        log(`${path.relative(process.cwd(), filePath)} was ${EVENT_MAP[event]}`);
        safeCallCallback(cb, filePath, event);
      }
    })
    .on('ready', () => {
      safeCallCallback(cb, null, 'ready');
      if (!Array.isArray(files)) {
        log.verbose(`Using ${files}, watching the following files:`);
      }
      else {
        log.verbose('Watching the following files:');
      }
      log.verbose(fileWatcher.getWatched());
    })
    .on('error', (error) => log.error(error));

  return fileWatcher;
}

module.exports = createFileWatcher;
