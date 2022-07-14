const { paramInjectRegex, funcCallWithSlotsRegex } = require('./regex');
const findFunctionCalls = require('./findFunctionCalls');
const validateFunctionCall = require('./validateFunctionCall');
const splitParams = require('./splitParams');
const validateFunctionParams = require('./validateFunctionParams');
const parseSlotParams = require('./parseSlotParams');

function prefixIndent(content, indent) {
  if (!indent) {
    return content;
  }
  return indent + content.split(/\r?\n/).join(`\n${indent}`);
}

/**
 * Takes a parsed function and injects the parameters into the template.
 *
 * Functions can call other functions, but a function cannot call itself.
 *
 * @param func The function object (from parseTwigFunctions.js) which content to generate
 * @param params The parameters being passed to the function
 * @param indent The level of indentation at the start of where the function call takes place
 * @param funcs The functions map (from parseTwigFunctions.js), in case the function uses other functions
 * @param callStack The list of function calls that preceded this one.
 * @returns {string} The content of the function with parameters inserted into the template
 */
function interpolateFunction(func, params, indent, funcs, callStack) {
  // we need to replace the parameters first, so the parameters of subsequent function calls are correct
  const paramsReplaced = func.params.reduce((acc, paramName, index) => {
    const paramVal = params[index];
    return acc.replace(new RegExp(`( *)<\\$= ${paramName} \\$>`, 'g'), (_, paramIndent) => {
      return prefixIndent(paramVal, paramIndent);
    });
  }, func.content);

  if (paramInjectRegex.test(paramsReplaced)) {
    throw new Error(`Twig function \`${func.name}\` is using a parameter \`${RegExp.$1}\` within it that's not part of the function definition's parameter list.`);
  }

  const indented = prefixIndent(paramsReplaced, indent);
  return interpolate(indented, funcs, func.fileName, {
    name: func.name,
    params: func.params.reduce((acc, key, index) => ({ ...acc, [key]: params[index] }), {}),
    stack: callStack,
  });
}

/**
 * Interpolates function calls, replacing the call with the resulting template
 *
 * Since functions can call other functions, this function is reused with `recursiveName`
 * as additional parameter.
 *
 * @param template The contents of the template to check for function calls
 * @param funcs The functions map (from parseTwigFunctions.js)
 * @param filePath The path to the file for improved error messages
 * @param [nested] The data of the function that is calling other functions
 * @returns {string} The new contents of the templates, with all functions replaced
 */
function interpolate(template, funcs, filePath, nested = {}) {
  const functionCalls = findFunctionCalls(template);

  return functionCalls.reduce((t, { funcName, params, indent, toReplace, index }) => {
    validateFunctionCall(funcs, funcName, filePath, nested);

    const funcDef = funcs[funcName];
    let paramValues = splitParams(params);

    validateFunctionParams(funcDef, paramValues, filePath);

    // support pass-through parameters so slots are a lot easier to manage when
    // passing parameters from one function to the next.
    if (nested.params) {
      paramValues = paramValues.map((name) => {
        if (nested.params[name]) {
          return nested.params[name];
        }
        return name;
      });
    }
    const callStack = nested.stack ? [...nested.stack, funcName] : [funcName];

    const substrTemplate = t.substr(index);
    const match = substrTemplate.match(funcCallWithSlotsRegex);
    let slots;
    if (match) {
      [toReplace, slots] = match;
    }

    // when we've found <$ endslots $>, check what slots have been defined.
    paramValues = parseSlotParams(slots, paramValues, funcName);

    return t.replace(toReplace, () => {
      return interpolateFunction(funcDef, paramValues, indent, funcs, callStack);
    });
  }, template);
}

module.exports = interpolate;
