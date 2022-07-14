const path = require('path');
const { readFile, writeFile } = require('fs/promises');
const MarkdownIt = require('markdown-it');
const MarkdownItAnchor = require('markdown-it-anchor');
const slugify = require('@sindresorhus/slugify')

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(MarkdownItAnchor, {
    slugify: s => slugify(s),
  });

const titleRegex = /<h1(?: id=".*?")?>(.*?)<\/h1>/;
function wrapInHtml(html, filePath) {
  const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'assets'));

  const match = html.match(titleRegex);
  const [_, title] = match;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <link href="${relativePath ? relativePath + '/' : './'}style.css" rel="stylesheet" />
</head>
<body>
${html.replace(/^/gm, "  ")}
</body>
</html>`
}

async function convertToHtml(markdownPath) {
  const mdContent = await readFile(markdownPath, 'utf-8');

  const htmlContent = wrapInHtml(md.render(mdContent), markdownPath);

  const fileName = path.basename(markdownPath).split('.')[0];
  const outputPath = path.join(path.dirname(markdownPath), `${fileName}.html`);
  await writeFile(outputPath, htmlContent, 'utf-8');
}

async function generateHtml() {
  await convertToHtml(path.join(process.cwd(), './assets/README.md'));
}

generateHtml();
