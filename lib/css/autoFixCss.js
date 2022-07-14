const regex = {
  urlWithQuotes: /url\(["'](.*?)["']\)/,
}

function autoFixCss(css) {
  return css.replace(regex.urlWithQuotes, (match, url) => `url(${url})`);
}

module.exports = autoFixCss;
