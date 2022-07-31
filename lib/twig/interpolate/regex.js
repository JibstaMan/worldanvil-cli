const funcCallRegex = /( +)?<\$\s+([a-zA-Z0-9_-]+)\(([^()$><]*?)\)\s+\$>/g;
const funcCallWithSlotsRegex = / *?<\$\s+[a-zA-Z0-9_-]+\([^()$><]*?\)\s+\$>(?:\W*?(<\$_ slot[\w\W]*?)<\$\s+endslots\s+\$>)?/;
const slotRegex = /<\$_\s+slot (.*?)\s+\$>(?:\r?\n)?( +)?([\w\W]*?)(<\$_\s+(?:endslot|slot\s+[^()$><]+)\s+\$>|$)/d;
const paramInjectRegex = /<\$=\s+(.*?)\s+\$>/;
const paramSplitRegex = /,\s*/;

module.exports = {
  funcCallRegex,
  funcCallWithSlotsRegex,
  slotRegex,
  paramInjectRegex,
  paramSplitRegex,
};
