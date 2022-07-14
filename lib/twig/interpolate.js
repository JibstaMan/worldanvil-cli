// const log = require('../log');
//
// function prefixIndent(content, indent) {
//   if (!indent) {
//     return content;
//   }
//   return indent + content.split(/\r?\n/).join(`\n${indent}`);
// }
//
// const paramInjectRegex = /<\$=\s+(.*?)\s+\$>/;
//
// /**
//  * Takes a parsed function and injects the parameters into the template.
//  *
//  * Functions can call other functions, but a function cannot call itself.
//  *
//  * @param func The function object (from parseTwigFunctions.js) which content to generate
//  * @param params The parameters being passed to the function
//  * @param indent The level of indentation at the start of where the function call takes place
//  * @param funcs The functions map (from parseTwigFunctions.js), in case the function uses other functions
//  * @param callStack The list of function calls that preceded this one.
//  * @returns {string} The content of the function with parameters inserted into the template
//  */
// function interpolateFunction(func, params, indent, funcs, callStack) {
//   // we need to replace the parameters first, so the parameters of subsequent function calls are correct
//   const paramsReplaced = func.params.reduce((acc, paramName, index) => {
//     const paramVal = params[index];
//     return acc.replace(new RegExp(`( *)<\\$= ${paramName} \\$>`, 'g'), (_, paramIndent) => {
//       return prefixIndent(paramVal, paramIndent);
//     });
//   }, func.content);
//
//   if (paramInjectRegex.test(paramsReplaced)) {
//     throw new Error(`Twig function \`${func.name}\` is using a parameter \`${RegExp.$1}\` within it that's not part of the function definition's parameter list.`);
//   }
//
//   const indented = prefixIndent(paramsReplaced, indent);
//   return interpolate(indented, funcs, func.fileName, {
//     name: func.name,
//     params: func.params.reduce((acc, key, index) => ({ ...acc, [key]: params[index] }), {}),
//     stack: callStack,
//   });
// }
//
// // function with (single/multi-line) parameters: ( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>
// // function with slots, but optional: (?:\W*?(<\$_[\w\W]*?)<\$\s+endslots\s+\$>)?
// const funcCallRegex = /( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>/g;
// const funcCallWithSlotsRegex = /( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>(?:\W*?(<\$_[\w\W]*?)<\$\s+endslots\s+\$>)?/g;
// const slotRegex = /<\$_\s+slot (.*?)\s+\$>([\w\W]*?)<\$_\s+endslot\s+\$>/g;
//
// /**
//  * Interpolates function calls, replacing the call with the resulting template
//  *
//  * Since functions can call other functions, this function is reused with `recursiveName`
//  * as additional parameter.
//  *
//  * @param template The contents of the template to check for function calls
//  * @param funcs The functions map (from parseTwigFunctions.js)
//  * @param filePath The path to the file for improved error messages
//  * @param [nested] The data of the function that is calling other functions
//  * @returns {string} The new contents of the templates, with all functions replaced
//  */
// function interpolate(template, funcs, filePath, nested = {}) {
//   return template.replace(funcCallWithSlotsRegex, (match, indent = '', funcName, params, slots) => {
//     if (!funcs[funcName]) {
//       throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, which hasn't been specified yet or was added in the wrong folder.`);
//     }
//     if (funcName === nested.name) {
//       throw new Error(`Twig function \`${funcName}\` (see "${filePath}") is calling itself, which is not supported.`)
//     }
//     if (nested.stack && nested.stack.includes(funcName)) {
//       const index = nested.stack.indexOf(funcName);
//       const circularStack = [...nested.stack.slice(index), funcName];
//       const errorMsg = `Twig function \`${funcName}\` is part of a circular function call-stack:`;
//       const circularMsg = circularStack.join(' -> ');
//       throw new Error([errorMsg, circularMsg].join('\n'));
//     }
//
//     let paramValues = params ? params.split(/,\s*/) : [];
//     // support multi-line parameters
//     if (params.includes('\n')) {
//       paramValues = paramValues.reduce((acc, param) => {
//         if (param) {
//           acc.push(param.trim());
//         }
//         return acc;
//       }, []);
//     }
//
//     const funcDef = funcs[funcName];
//     if (funcDef.params.length !== paramValues.length) {
//       if (funcDef.params.length > paramValues.length) {
//         const missingParams = funcDef.params.slice(paramValues.length)
//         throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, but is missing values for the following parameters: ${log.list(missingParams)}.`);
//       }
//       else {
//         const diff = paramValues.length - funcDef.params.length;
//         throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, but is passing ${diff} parameter${diff > 1 ? 's' : ''} too many.`);
//       }
//     }
//
//     // support pass-through parameters so slots are a lot easier to manage when
//     // passing parameters from one function to the next.
//     if (nested.params) {
//       paramValues = paramValues.map((name) => {
//         if (nested.params[name]) {
//           return nested.params[name];
//         }
//         return name;
//       });
//     }
//
//     // when we've found <$ endslots $>, check what slots have been defined.
//     if (slots) {
//       let match;
//       do {
//         match = slotRegex.exec(slots);
//         if (!match) {
//           continue;
//         }
//
//         const [_, paramName, slotContent] = match;
//         const index = paramValues.indexOf(paramName);
//         if (index < 0) {
//           throw new Error(`Twig function \`${funcName}\` has a slot called "${paramName}" within it that's not part of the function call's parameter list.`);
//         }
//         paramValues[index] = (indent)
//           ? slotContent.trim().replace(new RegExp(`^${indent}`, 'gm'), '')
//           : slotContent.trim();
//       }
//       while (match);
//     }
//
//     const callStack = nested.stack ? [...nested.stack, funcName] : [funcName];
//
//     return interpolateFunction(funcDef, paramValues, indent, funcs, callStack);
//   });
// }
//
// module.exports = interpolate;
