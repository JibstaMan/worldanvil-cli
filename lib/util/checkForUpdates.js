const { spawn } = require('child_process');
const semver = require('semver');
const getConfig = require('./getConfig');
const cliPackageJson = require('../../package.json');
const log = require('../log');

function getLatest(failSilent) {
  return new Promise((resolve, reject) => {
    const cp = spawn('npm', ['show', cliPackageJson.name, 'version'], {
      shell: true,
      stdio: ['pipe', 'pipe', failSilent ? 'pipe' : 'inherit'],
    });
    let version = '';
    cp.on('close', (code) => {
      if (code !== 0) {
        return reject();
      }
      return resolve(version);
    });
    cp.on('error', (error) => {
      return reject(error);
    });
    cp.stdout.on('data', (data) => {
      version = data.toString().replace(/\s/g, '');
    });
  })
}

async function checkForUpdates(shouldLog = false) {
  const installedVersion = cliPackageJson.version;

  let latestVersion;
  try {
    latestVersion = await getLatest(shouldLog);
  }
  catch (e) {
    if (shouldLog) {
      const msg = e ? `: ${e.message}` : '';
      log.verbose(` > Latest version check failed${msg}`);
      log();
    }
    else {
      log();
      throw new Error('Failed to determine latest version. Check above for the NPM error.');
    }
    return [false];
  }

  const notUpToDate = semver.lt(installedVersion, latestVersion);
  if (notUpToDate) {
    if (shouldLog) {
      log(`There's an update available for \`${cliPackageJson.name}\`.`);
      log('You have ' + log.c.em(installedVersion) + ', latest version is ' + log.c.success(latestVersion) + '.');
      log(`If you want to update, run \`npm i ${cliPackageJson.name}@latest\` in a terminal or double-click the \`update.bat\` file to update.`);
      log();
    }
  }
  else {
    log.verbose(' > Still up-to-date');
  }
  return [notUpToDate, latestVersion];
}

async function maybeCheckForUpdates(shouldLog = true) {
  const shouldCheckForUpdates = getConfig('checkForUpdates');
  if (!shouldCheckForUpdates) {
    return null;
  }

  log.verbose('- Checking for updates');
  const [notUpToDate] = await checkForUpdates(shouldLog);
  return notUpToDate;
}

module.exports = { checkForUpdates, maybeCheckForUpdates };
