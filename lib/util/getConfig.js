const path = require('path');

let loadedConfig = null;

function tryRequire(fileName) {
  try {
    return require(path.join(process.cwd(), fileName));
  }
  catch {
    return undefined;
  }
}

function getConfigKey(config, key, isRequired) {
  if (!key) {
    return config;
  }

  const path = key.split('.');
  return path.reduce((obj, subPath) => {
    if (obj[subPath] === undefined) {
      if (isRequired) {
        throw new Error(`Missing config: \`${key}\``);
      }
      return undefined;
    }
    return obj[subPath];
  }, config);
}

function getConfig(key, isRequired = true, defaultVal = undefined) {
  if (loadedConfig) {
    return getConfigKey(loadedConfig, key, isRequired) ?? defaultVal;
  }

  let fileName = 'waconfig.js';
  loadedConfig = tryRequire(fileName);

  if (!loadedConfig) {
    throw new Error("Couldn't find the `waconfig.js` file, you need to run the `init` command first.");
  }
  return getConfigKey(loadedConfig, key, isRequired) ?? defaultVal;
}

module.exports = getConfig;
