const log = require('../../log');

function validateFunctionParams(funcDef, params, filePath) {
  const funcName = funcDef.name;
  if (funcDef.params.length !== params.length) {
    if (funcDef.params.length > params.length) {
      const missingParams = funcDef.params.slice(params.length)
      throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, but is missing values for the following parameters: ${log.list(missingParams)}.`);
    }
    else {
      const diff = params.length - funcDef.params.length;
      throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, but is passing ${diff} parameter${diff > 1 ? 's' : ''} too many.`);
    }
  }
}

module.exports = validateFunctionParams;
