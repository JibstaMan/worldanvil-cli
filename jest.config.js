module.exports = {
  collectCoverageFrom: [
    './lib/**',
    // ignore CLI functions
    '!./lib/*.js',
    // exclude some helpers and convenience functions
    '!./lib/util/+(createFileWatcher|readFile|writeFile).js',
    // exclude convertLess, since that would mostly test the LESS dependency
    '!./lib/css/convertLess.js',
    // exclude generateTemplate, since it's file system stuff
    `!./lib/twig/generateTemplates.js`,
    // exclude watch files
    '!./lib/+(css|twig)/watch.js',
  ]
}