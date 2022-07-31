/**
 * This is a special version of string.matchAll
 *
 * The last capture group is ignored when moving within the content. So the end of the
 * regex (the last capture group) can be reused as start of the next match.
 *
 * @param regex The regex, make sure to include the `d` flag and exclude the `g` flag.
 * @param content The string content to match within
 * @returns {[[string]]} The matches, excluding the "entire match" and the last match
 */
function matchAll(regex, content) {
  const matches = [];

  let match = regex.exec(content);
  let newContent = content;

  if (!match) {
    return [];
  }

  do {
    const matchLength = match.indices.length - 1;
    const endIndex = match.indices[matchLength][0];
    matches.push(match.slice(1, matchLength));

    newContent = newContent.substr(endIndex);
    match = regex.exec(newContent);
  }
  while (match);

  return matches;
}

module.exports = matchAll;
