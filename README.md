# Unofficial World Anvil CLI

[![npm](https://badgen.net/npm/v/@jibstasoft/worldanvil-cli)](https://www.npmjs.com/package/@jibstasoft/worldanvil-cli)
[![license](https://badgen.net/npm/license/@jibstasoft/worldanvil-cli)](https://github.com/JibstaMan/worldanvil-cli/blob/main/LICENSE)
[![packagephobia](https://badgen.net/packagephobia/install/@jibstasoft/worldanvil-cli)](https://packagephobia.com/result?p=@jibstasoft/worldanvil-cli)

Create a sort of developer environment for your World Anvil theme and/or templates.

This command-line interface allows you to use advanced tools to increase your productivity:
- [LESS](./docs/less): use nesting for selectors and split your CSS up into multiple files
  - The CLI keeps [World Anvil's Security Filter](https://www.worldanvil.com/w/WorldAnvilCodex/a/css#security) in mind, informing you when you hit the filter.
- [Twig](https://twig.symfony.com/doc/3.x/templates.html) with [custom functions](./docs/twig.md): create reusable Twig snippets to use in any of your custom article templates.
- Use your favorite editor (e.g. free [Visual Studio Code](https://code.visualstudio.com/) with [TWIG pack](https://marketplace.visualstudio.com/items?itemName=bajdzis.vscode-twig-pack) plugin)

And hopefully more to come soon.

_Note: This CLI's LESS features are for Master Worldsmiths and above and the Twig features for Grandmaster Worldsmiths and above. The CLI will ask you for your membership tier, so it can disable certain features. Feel free to choose whichever tier you'd like._

## Table of contents
- [Pitch](#pitch)
  - [Why a CLI](#why-a-cli)
- [Installation](#installation)
- [Config](#config)
- [Commands](#commands)
- [Limitations](#limitations)
- [References](#references)

## Pitch

This tool was created for people who like maintainability and automation.

Writing CSS selectors is cumbersome, [nesting selectors](./docs/less.md) is just so much easier! With LESS, you can also split up your CSS into many files and the CLI will output a single CSS file. Then all you have to do is copy-paste the contents of that file into the World Styling Editor to update your theme. And as a cherry on top, the CLI will validate your CSS based on World Anvil's security filters. This ensures you're never wondering why your valid CSS isn't working and can quickly fix the issue.

The Twig templating language doesn't support functions within templates. This seriously impedes its usefulness, especially when you want to maintain many templates for different types of articles. So the CLI introduces a [powerful capability to write functions](./docs/twig.md) to make reusable snippets possible! Use those functions in as many article templates as you want to stay consistent and improve productivity and maintainability.

The CLI has `watch` commands, so it will automatically generate the output again as you save!

### Why a CLI?

CLI means that it doesn't come with a graphical user interface. Instead, you need a terminal to interact with the program. It means you can use your favorite editing tools and use the CLI to generate the desired output.

I can imagine using a terminal sounds daunting, but I assure you, I've done my absolute best to make it as user-friendly and uninvolved as possible. And if you have feedback and ideas, I'd love to hear them!

When you install (run `init`, see [Installation](#installation)), you'll be asked if you want to create batch (`.bat`) files, which effectively make the CLI usable by double-clicking certain files. So once installed, you won't actually need to open a terminal yourself anymore.

## Installation

Unofficial World Anvil CLI is a command-line interface written in `NodeJS` and usable through `npx`.
- Install [NodeJS](https://nodejs.org/en/) v14+ (`npm`/`npx` come included).
- Create a project folder in which you'll create the theme and/or templates.
  - Make sure it doesn't contain special characters like `&` in the entire path, otherwise `npx` will not function properly.

___Executing a file:___

Don't want to use a terminal? I've got you covered!
- Create a file in the folder you just created:
  - [Windows] Call it `install.bat` and copy-paste [this content](https://raw.githubusercontent.com/JibstaMan/worldanvil-cli/main/assets/install.bat) into the file.
- Double-click the file to start the installation process. This will automatically open a terminal.
  - The terminal will download the source code for `@jibstasoft/worldanvil-cli`, which will take a few seconds.
  - Then the terminal will ask you a number of questions with detailed explanations.

___Using a terminal:___
- Open that folder in a terminal ([read how](./docs/terminal.md#opening-a-terminal)).
- In the terminal, type: `npx @jibstasoft/worldanvil-cli init`
  - The terminal will download the source code for `@jibstasoft/worldanvil-cli`, which will take a few seconds.
  - Then the terminal will ask you a number of questions with detailed explanations.

## Config

The CLI requires a `waconfig.js` to work, which will be created when running the `init` command during the installation process. This is a JavaScript file, but functions like a JSON file. It's a JavaScript file, so it can have comments and is slightly easier to work with.

For more details about what you can change within the config file, check your project folder for `README.html` or the [config documentation for the most recent version on GitHub](./assets/README.md#config).

## Commands

Here is an overview of the commands that are currently available:
- `init` - create a new project folder where you can use the CLI.
- `update` - will automatically update the CLI to the latest version and update your `waconfig.js` if needed.
- `build` - takes the source code and compiles it into the desired output.
- `watch` - run `build` command whenever any of the files are saved.
- `css build` - `build` limited to LESS code.
- `css watch` - `watch` limited to LESS code.
- `twig build` - `build` limited to Twig templates and functions.
- `twig watch` - `watch` limited to Twig templates and functions.
- `--debug` - can be added to any command to make it log a lot more information.

Check your project folder for `README.html` for the commands related to your version or the [commands documentation for the most recent version on GitHub](./assets/README.md#globs).

## Troubleshooting

In case you run into issues, don't hesitate to ask for help using the [issues tab](https://github.com/JibstaMan/worldanvil-cli/issues).

The [Troubleshooting docs](./docs/troubleshooting.md) contains a list of issues that you can solve on your end.

## Limitations

With the current version of the CLI, you can only maintain the theme (and "Authoring Panel CSS") for a single world. If you want to use the CLI for multiple worlds, you'll need to `init` the CLI in different folders.

At this time, the features to circumvent a terminal are Windows specific. The documentation about opening a terminal is also Windows centric. I don't have a Mac, so I'd love to hear from you if you can help improve on this.

Feel free to leave a feature request in the [issues tab](https://github.com/JibstaMan/worldanvil-cli/issues).

## References

### Docs
- [LESS quick start guide](./docs/less.md)
- [Twig custom functions guide](./docs/twig.md)
- [Commands reference](./assets/README.md#commands)
- [Configuration reference](./assets/README.md#config)
- [Changelog](./CHANGELOG.md)

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