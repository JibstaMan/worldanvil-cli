# LESS quick start guide

This documentation is a shortened version of [LESS features](https://lesscss.org/features/). You'll need a basic understanding of CSS before reading this guide.

- [Nested rules](#nested-rules)
- [Parent selectors](#parent-selectors)
- [Variables](#variables)
- [Imports](#imports)

## Nested rules

CSS requires you to write out the entire selector every time. In LESS, you can use nesting, so you don't have to repeat yourself all that often. Especially with scopes like `.user-css`, this makes things much easier.

In CSS, you would write:
```css
.user-css h2,
.user-css h3,
.user-css h4 {
  font-family: source sans pro, sans-serif;
}

.user-css h2 {
  color: #D5382A;
}
```

In LESS, you can use nesting to achieve the same CSS:
```less
.user-css {
  h2, h3, h4 {
    font-family: source sans pro, sans-serif;
  }

  h2 {
    color: #D5382A;
  }
}
```

## Parent selectors

Using the `&` operator, you can re-use the parent selector within a nested rule. 

```less
.user-css {
  a {
    color: blue;
    &:hover { /* .user-css a:hover */
      color: green;
    }
  }
  
  .btn {
    &-default { /* .user-css .btn-default */
      color: #333;
      background-color: #fff;
      border-color: #ccc;
    }
    &-opaque { /* .user-css .btn-opaque */
      opacity: .5;
    }
  }
}
```

_Read more about [Parent Selectors](https://lesscss.org/features/#parent-selectors-feature)._

## Variables

CSS has built-in support for variables, so we should use that instead of the variables supported by LESS.

```less
* {
  --fontContent: source sans pro, sans-serif;
  --fontHeadings: alegreya sc, sans-serif;
  /* Normal D&D theme colors */
  --colorRed: #D5382A;
  --colorDarkRed: #5C3A31;
  --colorRedBrown: #46271E;
  --colorBrown: #674534;
  --colorYellow: #AF945C;
  --colorCream: #FAF7EA;
  --colorDarkCream: #EFE6D4;
}

.user-css {
  h2, h3, h4 {
    font-family: var(--fontHeadings);
  }
  
  h2 {
    color: var(--colorRed);
  }
  
  h3 {
    color: var(--colorDarkRed);
  }
  
  h4 {
    color: var(--colorRedBrown)
  }
}
```

## Imports

You can split up your LESS into as many files as you like. To achieve this, you'll need to use the `@import` statement:

```less
/* within less/theme.less */
@import "vars";         /* e.g. for defining CSS variables */
@import "fonts";        /* e.g. for defining @font-face rules */
@import "animations";   /* e.g. for defining @keyframes rules */
@import "presentation"; /* e.g. for defining bg image */
@import "page";         /* e.g. for styling the headings, etc */ 
@import "sidebar";      /* e.g. for styling the sidebar */
```

This is of course just an example, you can choose whatever works best for you. The `theme.less` file itself can also still include LESS after the import statements.

Note: the `@import` statements are relative to the directory that contains your `theme.less` (more specifically the value within `css.presentation.entry` or `css.authoringPanel.entry` in your config).

### Folders

If you have a lot of LESS files, chances are you'll want to split things up into folders. Let's look at an example:

`theme.less`:
```less
/* use index.less file to import everything within the folder */
@import "basics/index";
/* manually import everything within page folder */
@import "page/page-base";
@import "page/page-person";
@import "page/page-location";
/* import file within the same folder */
@import "sidebar";
```

`basics/index`:
```less
@import "vars";
@import "fonts";
@import "animations";
```

You can call `index.less` whatever you like. `index` is a convention that indicates it's the entry or starting point for a folder. Having these `@import` statements in it, ensures that all files within the `basics` folder are included when you `@import "basics/index"`.

If you want to reuse those styles within `authoringPanel`, you only need to add a single import and maintain the `index.less` file when adding more files to the `basics` folder.
