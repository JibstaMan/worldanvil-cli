function validateFunctionCall(funcs, funcName, filePath, nested) {
  if (!funcs[funcName]) {
    throw new Error(`Twig template "${filePath}" is using function \`${funcName}\`, which hasn't been specified yet or was added in the wrong folder.`);
  }
  if (funcName === nested.name) {
    throw new Error(`Twig function \`${funcName}\` (see "${filePath}") is calling itself, which is not supported.`)
  }
  if (nested.stack && nested.stack.includes(funcName)) {
    const index = nested.stack.indexOf(funcName);
    const circularStack = [...nested.stack.slice(index), funcName];
    const errorMsg = `Twig function \`${funcName}\` is part of a circular function call-stack:`;
    const circularMsg = circularStack.join(' -> ');
    throw new Error([errorMsg, circularMsg].join('\n'));
  }
}

module.exports = validateFunctionCall;
