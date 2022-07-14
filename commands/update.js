const path = require('path');
const { copyFile: fsCopyFile, readFile, writeFile } = require('fs/promises');
const runSafeCommand = require('../lib/util/runSafeCommand');
const getConfig = require('../lib/util/getConfig');
const { checkForUpdates } = require('../lib/util/checkForUpdates');
const cliPackageJson = require('../package.json');
const log = require('../lib/log');
const { spawn } = require('child_process');

const assetDir = path.resolve(__dirname, '../assets');

exports.command = 'update';

exports.describe = `After installing the latest version of \`${cliPackageJson.name}\`, this command will update your \`waconfig.js\``;

exports.builder = {};

function npmUpdate() {
  return new Promise((resolve, reject) => {
    const cp = spawn('npm', ['i', `${cliPackageJson.name}@latest`], {
      shell: true,
      stdio: 'inherit',
    });

    cp.on('close', (code) => {
      if (code !== 0) {
        return reject('Failed to install the NPM packages. Check above for the NPM error.');
      }
      return resolve();
    });
    cp.on('error', (error) => {
      return reject(error);
    });
  });
}

const versionRegex = /version: ["'](.*?)["']/;
const cliVersionRegex = /cliVersion: ["'](.*?)["']/;
async function updateCliVersion() {
  const waconfigFilePath = path.join(process.cwd(), 'waconfig.js');
  let waconfig = await readFile(waconfigFilePath, 'utf-8');
  waconfig = waconfig.replace(cliVersionRegex, `cliVersion: "${cliPackageJson.version}"`);
  return writeFile(waconfigFilePath, waconfig, 'utf-8');
}

function copyFile(fileName) {
  return fsCopyFile(path.join(assetDir, fileName), path.join(process.cwd(), fileName));
}

async function copyFilesForCliUpdate() {
  log.verbose('- Overwriting "README.md", "README.html" and "style.css" with updated info about `worldanvil-cli`.');
  await copyFile('README.md');
  await copyFile('README.html');
  await copyFile('style.css');
}

async function update(argv) {
  const [hasUpdates, latestCliVersion] = await checkForUpdates();
  const cliVersion = getConfig('cliVersion');

  if (!hasUpdates) {
    // check if an actual updated version was installed.
    if (cliPackageJson.version === cliVersion) {
      log();
      log('The CLI and the ' + log.c.em('waconfig.js') + ' file are ' + log.c.success('up-to-date') + '.');
      process.exit(0);
    }

    await copyFilesForCliUpdate();
    await updateCliVersion();
    log();
    log('The CLI and the ' + log.c.em('waconfig.js') + ' file are ' + log.c.success('up-to-date') + '.');
    process.exit();
  }

  await npmUpdate();

  await copyFilesForCliUpdate();

  const configVersion = getConfig('version');

  let conf = await readFile(path.join(assetDir, 'default-waconfig.js.template'), 'utf-8');

  const match = conf.match(versionRegex);
  if (!match) {
    throw new Error("Malformed `waconfig.js.template`, it's missing `version: ''`. Please create a bug report.");
  }

  // config version is up-to-date
  if (match[1] === configVersion) {
    await updateCliVersion();
    log();
    log('The CLI has been updated to version ' + log.c.success(latestCliVersion) + '.');
    log('The existing ' + log.c.em('waconfig.js') + ' file is ' + log.c.success('up-to-date') + '.');
    return process.exit(0);
  }

  // TBD
  // take `conf`, apply `path.join(process.cwd, 'waconfig.js')`'s data, ask questions for new options?
}

exports.handler = async function updateCommand(argv) {
  await runSafeCommand(update, argv);
}
