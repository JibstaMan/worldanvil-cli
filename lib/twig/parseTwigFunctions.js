const readTemplateFiles = require('./readTemplateFiles');

const funcRegex = /^<\$\s*function\s*([a-zA-Z0-9_-]+)\s*\((.*?)\).*?\$>$/m;
function parseTwigFunction(twigFunc, fileName) {
  const match = funcRegex.exec(twigFunc);
  if (!match) {
    throw new Error(`Twig function "${fileName}" doesn't have function definition specific. Please add \`<$ function funcName(param1, param2) $>\` to the top of the file.`);
  }
  const [matchBody, funcName, params] = match;
  return {
    name: funcName,
    fileName,
    params: params ? params.split(/,\s*/) : [],
    content: twigFunc.replace(matchBody, '').replace(/^\r?\n/, ''),
  };
}

async function parseTwigFunctions() {
  const twigFuncs = await readTemplateFiles(false);

  return twigFuncs.reduce((acc, { content, filePath }) => {
    const twigFuncConf = parseTwigFunction(content, filePath);
    acc[twigFuncConf.name] = twigFuncConf;
    return acc;
  }, {});
}

module.exports = { parseTwigFunctions, parseTwigFunction };
