const { writeFile: fsWriteFile, mkdir } = require('fs/promises');
const path = require('path');

function ensureExtension(filePath, extension) {
  if (!extension) {
    return filePath;
  }
  return filePath.replace(new RegExp(`(\\.${extension})?$`), `.${extension}`);
}

async function writeFile(filePath, content, extension) {
  const outputPathWithExt = ensureExtension(path.join(process.cwd(), filePath), extension);
  await mkdir(path.dirname(outputPathWithExt), { recursive: true });
  await fsWriteFile(outputPathWithExt, content, 'utf-8');
  return path.normalize(filePath);
}

module.exports = writeFile;