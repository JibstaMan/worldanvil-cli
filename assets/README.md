# Unofficial World Anvil CLI

This project was created using the [unofficial World Anvil CLI](https://github.com/jibstaman/worldnanvil-cli#readme) ([@jibstasoft/worldanvil-cli](https://www.npmjs.com/package/@jibstasoft/worldanvil-cli)).

## Table of contents
- [CLI](#cli)
- [Commands](#commands)
  - [Build](#build)
  - [Watch](#watch)
  - [Sub-commands](#sub-commands)
- [Config](#config)
  - [Globs](#globs)
- [References](#references)

## CLI

This command-line interface allows you to use advanced tools to increase your productivity:
- [LESS](https://github.com/jibstaman/worldanvil-cli/blob/main/docs/less.md): use nesting for selectors and split your CSS up into multiple files
  - The CLI keeps [World Anvil's Security Filter](https://www.worldanvil.com/w/WorldAnvilCodex/a/css#security) in mind, informing you when you hit the filter.
- [Twig](https://twig.symfony.com/doc/3.x/templates.html) with [custom functions](https://github.com/jibstaman/worldanvil-cli/blob/main/docs/twig.md): create reusable Twig snippets to use in any of your custom article templates.
- Use your favorite editor (e.g. free [Visual Studio Code](https://code.visualstudio.com/) with [TWIG pack](https://marketplace.visualstudio.com/items?itemName=bajdzis.vscode-twig-pack) plugin)

## Commands

Add `--debug` to any command to have it log a lot more information. This can help you better understand what the CLI is doing if something isn't working as expected.

The CLI does include `--help` option to get information about its usage, but since the commands are so straight-forward, you'll likely never use it. You can also use `--help` for individual commands to get more information about the options for that specific command.

### Build

"Build" means taking your source code files and compiling them into the desired output.
- In the case of LESS, it will generate a single `.css` file that you can copy-paste into World Anvil's "World Styling Editor".
- In the case of templates, it will generate the Twig template output, with all function calls replaced, so you can copy-paste them into your custom article templates.

To build your source code, you can run:
```shell
npm build
```

Or you can run it through `npx`:
```shell
npx @jibstasoft/worldanvil-cli build
```

Or double-click the `build.bat` file if you had the `init` command generate those.

### Watch

"Watch" means it will keep an eye on your files and when you save, create or delete a file, it will build the output automatically. Any errors will be logged, but will not end the process, allowing you to fix them and automatically have the output generated again. **To stop the long-running process, press `Ctrl+C`.**

To watch your source code, you can run:
```shell
npm start
```

Or you can run it through `npx`:
```shell
npx @jibstasoft/worldanvil-cli watch
```

Or double-click the `watch.bat` file if you had the `init` command generate those.

### Sub-commands

The following commands are the same as above, but for specific features. The commands above will check your config to determine whether you have CSS and/or Twig features enabled. The commands below will ignore those settings. So for example, if you have the Twig features disabled, `css build` and `build` will do exactly the same thing.

#### CSS Build

This command takes your LESS files and generates the CSS output. It ignores your Twig templates.

To build your LESS source code, you can run:
```shell
npx @jibstasoft/worldanvil-cli css build
```

Or double-click the `cssBuild.bat` file if you had the `init` command generate those.

#### CSS Watch

To watch your LESS source code, you can run:
```shell
npx @jibstasoft/worldanvil-cli css watch
```

Or double-click the `cssWatch.bat` file if you had the `init` command generate those.

#### Twig Build

This command takes your Twig templates, replace all function calls with the output of those functions and generates the templates output. It ignores your LESS code.

To build your Twig templates source code, you can run:
```shell
npx @jibstasoft/worldanvil-cli twig build
```

Or double-click the `twigBuild.bat` file if you had the `init` command generate those.

#### Twig Watch

To watch your Twig templates source code, you can run:
```shell
npx @jibstasoft/worldanvil-cli twig watch
```

Or double-click the `twigWatch.bat` file if you had the `init` command generate those.

### Update

When there's a new version of the CLI available, you can run this command to install the update. It's probably a good idea to stop any running `watch` command using `Ctrl+C`.

The update command will ensure your environment stays current and accurate. This includes overwrite this documentation with the latest version. If the new version has an updated `waconfig.js`, it will take your config and apply it to the updated version.

```shell
npx @jibstasoft/worldanvil-cli update
```

Or double-click the `update.bat` file if you had the `init` command generate those.

## Config

The `waconfig.js` file has a lot of comments to help you understand each option. Below, the more advanced features are documented in greater detail.

### Globs

The CLI uses "globs" to determine where to find certain files. A [glob](https://github.com/isaacs/node-glob#glob-primer) resembles a file path which allows for one or more files to be found.

#### Twig templates and functions

For starters, let's look at the default glob used for the Twig templates:
```
templates: "templates/*.twig"
```

This will find any files ending with `.twig` within the `templates` folder, but will not look within any of its sub-folders (like `functions`).

Now let's say you want to use sub-folders within the `templates` folder and `functions` folder.
```
templates: "templates/**/*.twig"
functions: "templates/functions/**/*.twig"
```

Anything underneath `templates/functions` is seen as a function, as long as the file ends with the `.twig` extension. By using `**/*.twig`, it will find files both inside the `templates/functions` folder directly or any of its sub-folders (or their sub-folders, etc).

For the templates, we're using the same pattern, which will also find everything underneath `functions`. However, the CLI will ensure any overlap is excluded, so templates will automatically exclude anything found by the `functions` glob.

You can use `--debug` when running a command (optionally add it yourself within the `.bat` files) to see what files the command finds. If the template and function globs find exactly the same files, the Twig commands will not find any files and won't function anymore.

## References

### Docs
- [LESS quick start guide](https://github.com/jibstaman/worldanvil-cli/blob/main/docs/less.md)
- [Twig custom functions guide](https://github.com/jibstaman/worldanvil-cli/blob/main/docs/twig.md)
- [Changelog](https://github.com/jibstaman/worldanvil-cli/blob/main/CHANGELOG.md)

### CSS
- [LESS docs](https://lesscss.org/features/)
- [Bootstrap v3.4](https://getbootstrap.com/docs/3.4/css/)
  - World Anvil uses Bootstrap, which has a lot of CSS features you can use.
- [World Anvil CSS Rules](https://www.worldanvil.com/w/WorldAnvilCodex/a/css#the-rules)
- [Container CSS](https://www.worldanvil.com/w/WorldAnvilCodex/a/css-grandmasters) _(Grandmaster)_
  - Tips on using `[container:class][/container]` and `[section:class][/section]` elements.
- [Example theme: Perillel](https://www.dropbox.com/s/kxgqvscy7bchiik/Perillel%20CSS.css?dl=0)
- [Stormbril CSS Add-ons](https://www.worldanvil.com/w/cathedris-stormbril/a/stormbril-s-css-add-ons21-article)

### Twig
- [Twig docs](https://twig.symfony.com/doc/3.x/templates.html)
- [World Anvil custom Twig filters](https://www.worldanvil.com/w/WorldAnvilCodex/a/block-template-filters-article)
- [Base World Anvil templates](https://github.com/iamromeo/worldanvil-templates/tree/master/article-templates/base-template)

### Other
- [Font Awesome icons](https://fontawesome.com/icons)
- [RPG Awesome icons](https://nagoshiashumari.github.io/Rpg-Awesome/)