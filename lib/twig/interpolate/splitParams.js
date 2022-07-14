const { paramSplitRegex } = require('./regex');

function splitParams(params) {
  const paramValues = params ? params.split(paramSplitRegex) : [];

  // support multi-line parameters
  if (params.includes('\n')) {
    return paramValues.reduce((acc, param) => {
      if (param) {
        acc.push(param.trim());
      }
      return acc;
    }, []);
  }

  return paramValues;
}

module.exports = splitParams;
