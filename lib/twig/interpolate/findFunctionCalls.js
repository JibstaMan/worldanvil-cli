const { funcCallRegex } = require('./regex');

function findFunctionCalls(template) {
  const functionCalls = [...template.matchAll(funcCallRegex)].map((match) => {
    const [toReplace, indent = '', funcName, params] = match;
    return {
      indent,
      funcName,
      params,
      toReplace,
      index: match.index,
    };
  });

  return functionCalls.sort((a, b) => {
    // higher indent first
    const indentDiff = b.indent.length - a.indent.length;
    if (indentDiff) {
      return indentDiff;
    }
    // higher index first
    return b.index - a.index;
  });
}

module.exports = findFunctionCalls;
