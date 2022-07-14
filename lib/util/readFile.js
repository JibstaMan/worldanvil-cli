const { readFile: fsReadFile } = require('fs/promises');
const path = require('path');

async function readFile(filePath, returnMap = true) {
  const content = await fsReadFile(path.join(process.cwd(), filePath), 'utf-8');

  if (returnMap) {
    return { content, filePath };
  }
  return content;
}

module.exports = readFile;