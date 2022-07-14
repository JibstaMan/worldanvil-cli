const funcCallRegex = /( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>/g;
// const funcCallWithSlotsRegex = /( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>(?:\W*?(<\$_[\w\W]*?)<\$\s+endslots\s+\$>)?/g;
const funcCallWithSlotsRegex = / *?<\$\s+[a-zA-Z0-9_-]+\([^()$><]*?\)\s+\$>(?:\W*?(<\$_ slot[\w\W]*?)<\$\s+endslots\s+\$>)?/;
const slotRegex = /<\$_\s+slot (.*?)\s+\$>\W( +)?([\w\W]*?)<\$_\s+endslot\s+\$>/g;
const paramInjectRegex = /<\$=\s+(.*?)\s+\$>/;
const paramSplitRegex = /,\s*/;

module.exports = {
  funcCallRegex,
  funcCallWithSlotsRegex,
  slotRegex,
  paramInjectRegex,
  paramSplitRegex,
};
