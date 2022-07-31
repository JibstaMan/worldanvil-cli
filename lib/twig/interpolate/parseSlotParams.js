const { slotRegex } = require('./regex');
const matchAll = require('../../util/matchAll');

function parseSlotParams(slots, params, funcName) {
  if (!slots) {
    return params;
  }

  const paramValues = [...params];

  matchAll(slotRegex, slots).forEach((match) => {
    const [paramName, slotIndent = '', slotContent] = match;
    const index = paramValues.indexOf(paramName);
    if (index < 0) {
      throw new Error(`Twig function \`${funcName}\` has a slot called "${paramName}" within it that's not part of the function call's parameter list.`);
    }
    paramValues[index] = (slotIndent)
      ? slotContent.trim().replace(new RegExp(`^${slotIndent}`, 'gm'), '')
      : slotContent.trim();
  });

  return paramValues;
}

module.exports = parseSlotParams;
