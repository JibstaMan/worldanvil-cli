const path = require('path');
const { copyFile: fsCopyFile, readFile, writeFile, mkdir } = require('fs/promises');
const { spawn } = require('child_process');
const askQuestions = require('../lib/askQuestions');
const runSafeCommand = require('../lib/util/runSafeCommand');
const getConfig = require('../lib/util/getConfig');
const { MEMBERSHIPS, BATCH_FILES, ERROR_CODES } = require('../lib/constants');
const cliPackageJson = require('../package.json');
const log = require('../lib/log');

const assetDir = path.resolve(__dirname, '../assets');

exports.command = 'init';

exports.describe = 'Initialize the current folder (working directory) as a World Anvil CLI project';

const OPTS = {
  membership: {
    alias: ['member', 'm'],
    choices: Object.entries(MEMBERSHIPS).map(([value, name]) => ({ name, value })),
    desc: 'Your membership tier, so we can fine-tune some of the CLI features to your membership tier',
    requestArg: true,
    question: () => {
      log(log.c.h('Membership tier'));
      log('Your membership tier has influence on some of the features provided by the CLI.');
      log('- ' + log.c.error(MEMBERSHIPS.master) + " don't have access to " + log.c.b('custom article templates') + ', so the Twig features will be disabled.');
      log('- ' + log.c.success(MEMBERSHIPS.sage) + ' and above can ' + log.c.b('white label') + ' their worlds, so some of the CSS validation is disabled for them.');
      log();
      return 'What is your membership tier?';
    },
    group: 'Init options:',
  },
  cssEnabled: {
    alias: ['css', 'c'],
    type: 'boolean',
    desc: 'Whether to enable the LESS to CSS features',
    default: true,
    requestArg: true,
    question: () => {
      log();
      log(log.c.h('LESS to CSS features'));
      log('The CLI makes it possible to write your CSS using the feature-set of LESS.');
      log('You can read more about that here: https://github.com/jibstaman/worldanvil-cli/blob/main/docs/less.md');
      log();
      return 'Would you like to enable the LESS to CSS feature?';
    },
    group: 'Init options:',
  },
  twigEnabled: {
    alias: ['twig', 't'],
    type: 'boolean',
    desc: 'Whether to enable the Twig features',
    default: false,
    requestArg: true,
    when: (args) => args.membership !== 'master',
    defaultQuestion: (args) => args.membership !== 'master',
    question: () => {
      log();
      log(log.c.h('Twig template features'));
      log('The CLI has a number of features aimed at making it easier to work with Twig templates.');
      log('You can read more about them here: https://github.com/jibstaman/worldanvil-cli/blob/main/docs/twig.md');
      log("If you're not planning on using the Twig features, you might as well disable them, but it won't matter for performance.");
      log();
      return 'Would you like to enable the Twig template features?';
    },
    group: 'Init options:',
  },
  batchFiles: {
    alias: ['bat', 'b'],
    type: 'boolean',
    desc: 'Whether to add batch files, so you can double-click a file instead of using a terminal',
    default: true,
    requestArg: true,
    question: () => {
      log();
      log(log.c.h('Batch files'));
      log("If you'd prefer not to use a terminal, the CLI can generate executable batch files for each CLI feature.");
      log('A batch file contains one or more commands, which will be executed when you double-click the file.');
      log();
      return 'Would you like to have those batch files generated?';
    },
    group: 'Init options:',
  },
  checkForUpdates: {
    type: 'boolean',
    desc: 'Whether to automatically check for updates whenever you run a command',
    default: true,
    requestArg: true,
    question: () => {
      log();
      log(log.c.h('Automatically check for updates'));
      log("When you're just using the CLI, it's hard to know when there are updates available.");
      log('So the best way to be informed about updates is by having the CLI check for updates automatically.');
      log();
      return 'Would you like the CLI to check for updates automatically?';
    },
  },
};

exports.builder = OPTS;

function createBatchFile(fileName) {
  const command = fileName.replace(/([A-Z])/g, (_, char) => ` ${char.toLowerCase()}`);
  const content = `call npx ${cliPackageJson.name} ${command}
pause`;
  log.verbose(`- Creating "${fileName}.bat" file.`);
  return writeFile(`${fileName}.bat`, content);
}

const ARG_TO_CONFIG_MAP = {
  membership: 'membershipTier',
  cssEnabled: 'css.enabled',
  twigEnabled: 'twig.enabled',
  checkForUpdates: 'checkForUpdates',
  cliVersion: 'cliVersion',
};

function configReplace(config, key, value) {
  return config.replace(new RegExp(`\{\{ ${ARG_TO_CONFIG_MAP[key]} }}`), value);
}

function npmInstall() {
  return new Promise((resolve, reject) => {
    const cp = spawn('npm', ['i'], {
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

function copyFile(fileName) {
  return fsCopyFile(path.join(assetDir, fileName), path.join(process.cwd(), fileName));
}

async function init(argv) {
  log();

  try {
    // we're expecting getConfig to throw
    getConfig();
    log.error('The `init` command cannot be executes when `waconfig.js` already exists.');
    process.exit(ERROR_CODES.INIT_IN_CLI_PROJECT);
  }
  catch (e) {
    // do nothing
  }

  log('Welcome to the ' + log.c.error('unofficial World Anvil CLI') + '!');
  log();
  log("You'll be asked a few questions to tailor the CLI to your wishes.");
  log('Note: you can change your choices at any time after the initialization process.');
  log();

  const args = await askQuestions(argv, OPTS);

  log();
  log.options(args, OPTS);

  log.verbose('- Adding "README.md", "README.html" and "style.css" with info about `worldanvil-cli`.');
  await copyFile('README.md');
  await copyFile('README.html');
  await copyFile('style.css');

  log.verbose('- Adding "package.json" with latest version of `worldanvil-cli`.');
  const packageJson = await readFile(path.join(assetDir, 'package.json'), 'utf-8');
  const packageJsonLatest = packageJson.replace(`"${cliPackageJson.name}": "^1.0.0"`, `"${cliPackageJson.name}": "^${cliPackageJson.version}"`);
  await writeFile('package.json', packageJsonLatest, 'utf-8');

  log('Installing dependencies ' + log.c.gray('(this should only take a few seconds)'));
  await npmInstall();

  log();
  log.verbose('- Adding "waconfig.js" to store chosen project configuration.');
  let conf = await readFile(path.join(assetDir, 'default-waconfig.js.template'), 'utf-8');
  conf = configReplace(conf, 'cliVersion', cliPackageJson.version);
  conf = Object.entries(args).reduce((acc, [key, val]) => {
    return configReplace(acc, key, val);
  }, conf);

  await writeFile('waconfig.js', conf);

  await mkdir('less');
  await writeFile('less/theme.less', '');

  await mkdir('templates/functions', { recursive: true });

  if (args.batchFiles) {
    await Promise.all(BATCH_FILES.map(createBatchFile));
  }

  log();
  log('DONE');
}

exports.handler = async function initCommand(argv) {
  await runSafeCommand(init, argv);
}
