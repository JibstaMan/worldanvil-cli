# Twig custom functions guide

[Twig](https://twig.symfony.com/doc/3.x/templates.html) is the templating language used by World Anvil for custom article templates _(which is a Grandmaster feature)_. Twig doesn't support writing functions within templates, which is a shame. To remedy this, I created a "simple" function system.

Please remember that this function system is basically a templating language on top of a templating language. So the output is just a Twig template, which is then input for a custom article template in World Anvil. So mentally, it can be hard to wrap your head around this duality.

- [Defining functions](#defining-functions)
  - [Function and parameter names](#1-function-and-parameter-names)
  - [Parameter usage](#2-parameter-usage)
  - [Usage within Twig expression](#3-usage-within-twig-expressions)
- [Function calls within templates](#function-calls-within-templates)
- [Function calls within functions](#function-calls-within-functions)
  - [Function parameter styles](#function-parameter-styles)
- [Slots: Twig template as parameter](#slots-twig-template-as-parameter)
  - [The importance of whitespace](#the-importance-of-whitespace)
- [Advanced usage](#advanced-usage)

## Defining functions

Each function should be in a separate file, found by the [functions glob](../assets/README.md#globs) within `waconfig.js`. An example of a function would be:

```html
<$ function articleLink(article, world) $>
<a
  href="{{ path('presentation_article', {
    'articleslug': <$= article $>.slug,
    'worldslug': <$= world $>.slug
  }) }}"
  class="article-link tooltipstered"
  data-article-id="{{ <$= article $>.id }}"
  data-article="{{ <$= article $>.id }}"
  data-article-privacy="{{ <$= article $>.state }}"
  data-template-type="{{ <$= article $>.slug|split('-')|last }}"
>
  {{ <$= article $> }}
</a>
```

There are a few things to note here:
1. The file starts with `<$ function functionName(param1, paramN) $>`, which is the "function declaration".
2. It uses `<$= paramN $>` to insert the value of inputs/parameters.
3. It can nest `<$= paramN $>` within Twig expressions: `{{  }}`.

A function without parameters would be defined as `<$ function functionName() $>`.

### 1. Function and parameter names

In order to use the function within templates, we need to give it a name. This is done at the top of the file. When defining the function, we also decide how many inputs it requires, which we'll call parameters from now on. In the example above, we named the function `articleLink` and decided we want two parameters, called `article` and `world`.

### 2. Parameter usage

Now that we have defined two parameters, we can use them anywhere within the function body. In the example above, we're using `<$= article $>` to insert the value of the first parameter and `<$= world $>` for the second parameter.

### 3. Usage within Twig expressions

By using `{{ <$= article $>.id }}`, we can pass variable paths to the function, leaving Twig to handle the rest for us. This means that the function can be used with any type of article.

So if we call `articleLink(article.species, article.world)`, the function will output a valid Twig template who's output will be a link to a Species article. `{{ <$= article $>.id }}` would become `{{ article.species.id }}` after building the Twig templates.

If we call `articleLink(article.currentLocation, article.world)`, we'd get a link to a Location article. `{{ <$= article $>.id }}` would become `{{ article.currentLocation.id }}` after building the Twig templates.

## Function calls within templates

With the function definition ready for use, we can call the function anywhere within our templates (the files found by the [templates glob](../assets/README.md#globs) within `waconfig.js`):

```html
<div class="col-md-4">
  <div class="panel panel-default card mb-3">
    <div class="panel-body card-body">
      {{ article.sidepanelcontenttop|BBcode }}
      <dl>
        <dt>{{ 'person.species'|trans({}, 'presentation') }}</dt>
        <dd>
          <$ articleLink(article.species, article.world) $>
        </dd>
        <dt>{{ 'person.current_location'|trans({}, 'presentation') }}</dt>
        <dd>
          <$ articleLink(article.currentLocation, article.world) $>
        </dd>
      </dl>
    </div>
  </div>
</div>
```
<details>
  <summary>Check the Twig template output</summary>

```html
<div class="col-md-4">
  <div class="panel panel-default card mb-3">
    <div class="panel-body card-body">
      {{ article.sidepanelcontenttop|BBcode }}
      <dl>
        <dt>{{ 'person.species'|trans({}, 'presentation') }}</dt>
        <dd>
          <a
            href="{{ path('presentation_article', {
              'articleslug': article.species.slug,
              'worldslug': article.world.slug
            }) }}"
            class="article-link tooltipstered"
            data-article-id="{{ article.species.id }}"
            data-article="{{ article.species.id }}"
            data-article-privacy="{{ article.species.state }}"
            data-template-type="{{ article.species.slug|split('-')|last }}"
          >
            {{ article.species }}
          </a>
        </dd>
        <dt>{{ 'person.current_location'|trans({}, 'presentation') }}</dt>
        <dd>
          <a
            href="{{ path('presentation_article', {
              'articleslug': article.currentLocation.slug,
              'worldslug': article.world.slug
            }) }}"
            class="article-link tooltipstered"
            data-article-id="{{ article.currentLocation.id }}"
            data-article="{{ article.currentLocation.id }}"
            data-article-privacy="{{ article.currentLocation.state }}"
            data-template-type="{{ article.currentLocation.slug|split('-')|last }}"
          >
            {{ article.currentLocation }}
          </a>
        </dd>
      </dl>
    </div>
  </div>
</div>
```
</details>

We're using `<$ articleLink(article.species, article.world) $>` to call the function. Note the absence of the word "function". If the function doesn't accept parameters, use `<$ functionName() $>`.

There are a few things to note about parameters. Parameters are comma (`,`) separated and cannot contain `(`, `)`, `<`, `>` or `$` characters. Anything else goes, even enters. These are all valid function calls:
```
{# Plain parameter values #}
<$ articleLink(article.species, article.world) $>

{# Twig templating as parameter value #}
<$ articleLink(article.species, {{ article.world }}) $>

{# parameters split by comma and enter #}
<$ articleLink(
  article.species,
  article.world
) $>

{# parameters split by comma and enter, but with a trailing comma #}
<$ articleLink(
  article.species,
  article.world,
) $>

{# multi-line Twig template as parameter. Please read slots below #}
<$ articleLink(
  {% if article.species %}
    {{ article.species }}
  {% endif %},
  article.world
) $>
```

Just because it is possible, doesn't mean it's a good idea. Multi-line parameters are useful to make long lists of parameter readable. Using short single-line Twig templating as parameters is convenient, but [read about slots below](#slots-twig-template-as-parameter) to see an alternative. Slots also don't have the `()<>$` limitation that normal parameters have, for true power and flexibility.

## Function calls within functions

Once you've written some basic functions, it's very likely you'll want to use those functions within other functions. This allows you to keep your functions small and serving a single purpose. Let's look at an example:

```html
<$ function articleLinkWithEdit(article, world) $>
<span>
  <$ articleLink(article, world) $>
  <a
    href="/world/{{ <$= article $>.slug|split('-')|last }}/{{ <$= article $>.id }}/edit"
    class="world-editor-link btn btn-xs btn-opaque btn-default"
    style="display: none;"
  >
    <i class="fas fa-pencil" aria-hidden="true"></i>
  </a>
</span>
```

We're starting the file by writing the function declaration. Within the function body, we call the `articleLink` function.

Note: you cannot call a function recursively, meaning calling `articleLink()` within the `function articleLink()` body. Neither can you create circular call chains, e.g. `articleLinkWithEdit() -> articleLink() -> articleLinkWithEdit()`.

### Function parameter styles

For functions calling other functions, there are three parameter styles:
1. `articleLink(article, world)` - "pass-through" parameters
2. `articleLink(article.currentLocation, article.world)` - custom parameters
3. `articleLink(<$= article $>, <$= world $>)` - manual "pass-through" parameters

#### Pass-through parameters

```html
<$ function articleLinkWithEdit(article, world) $>
<!--                            ^^^^^^^  ^^^^^ <-- function definition parameters -->
<span>
  <$ articleLink(article, world) $>
<!--             ^^^^^^^  ^^^^^ <-- function call parameters -->
```

The `articleLinkWithEdit` function _definition_ accepts two parameters called `article` and `world`. Those exact words are also used as parameters when _calling_ `articleLink(article, world)` within `articleLinkWithEdit`'s function body. Because the naming exactly matches, the parameter value `articleLinkWithEdit` received will be passed as-is to the `articleLink` function.

This parameter style is the cleanest, but it was implemented to support slot parameters without having to repeat the slot syntax within function files. Read more about slots below.

#### Custom parameters

You can just call the function like you would in a template, without using the parameter values that your function (e.g. `articleLinkWithEdit`) receives.

Of course, given the _Pass-through parameter_ logic, you cannot call a function with parameter values that match the function definition's parameter names. Only exact matches cannot be used, so `article.currentLocation` will still work, even though `article` is a parameter of `articleLinkWithEdit`.

#### Manual pass-through parameters

When a function is executed, it first replaces all occurrences of `<$= param $>` with the value given to the function. So when calling `articleLinkWithEdit(article.species, article.world)`, all `<$= article $>` occurrences are replaced with `article.species` and all `<$= world $>` occurrences are replaced with `article.world`. After all parameter values have been replaced, it will call any functions within the function body.

So when writing `articleLink(<$= article $>, <$= world $>)`, it will be `articleLink(article.species, article.world)` before the `articleLink` function gets executed.

This syntax is not suitable for slots, because parameters would likely include `()<>$` characters. After replacing the parameters, the `articleLink` would become an invalid function call. The CLI would ignore it, instead of replacing it with the `articleLink` function's body.

## Slots: Twig template as parameter

So far, we've passed pretty simple values to our functions. This is already powerful. However, HTML lends itself really well to a component-based mental model, where a function represents a component, rather than a snippet. HTML is a hierarchy with parent-children relationships. And that's what the function examples above have been lacking, the capability to continue adding children to something defined within a function. That's what "slots" is here to solve!

For slots, the function definition mostly remains the same. You'll just need to use the _Pass-through parameter_ style to ensure the function supports slots. The other thing that changes is how you call those functions.

```html
<$ characterTabs(personality, social) $>
<$_ slot personality $>
<h2>{{ 'person.personality_characteristics'|trans({},'presentation') }}</h2>
{% if article.motivation|length > 0 %}
  <h3>{{ 'person.motivation'|trans({},'presentation') }}</h3>
  <p>{{ article.motivation|BBcode }}</p>
{% endif %}
{% if article.savviesIneptitudes|length > 0 %}
  <h3>{{ 'person.savvies_ineptitudes'|trans({},'presentation') }}</h3>
  <p>{{ article.savviesIneptitudes|BBcode }}</p>
{% endif %}
<$_ slot social $>
<h2>{{ 'person.social'|trans({},'presentation') }}</h2>
{% if article.relations|length > 0 %}
  <h3>{{ 'person.contacts_relations'|trans({},'presentation') }}</h3>
  <p>{{ article.relations|BBcode }}</p>
{% endif %}
{% if article.family|length > 0 %}
  <h3>{{ 'person.family_ties'|trans({},'presentation') }}</h3>
  <p>{{ article.family|BBcode }}</p>
{% endif %}
<$ endslots $>
```

So there are a few things to note here:
1. We have a new notation for slots: `<$_ slot paramName $>`. `paramName` should match the name used within the function _call_, so the `personality` slot will be used as the value for the first parameter.
2. Everything between `<$_ slot personaliy $>` and `<$_ slot social $>` is used as value for the `personality` parameter. Everything between `<$_ slot social $>` and `<$ endslots $>` is used for the `social` parameter.
3. Make sure your function call ends with `<$ endslots $>` to indicate where that specific function's slots end. This allows slot names to be used multiple times within the same template.

_If you prefer to have explicit slot closing tags, you can use `<$_ endslot $>`. But we're lazy and the fewer characters we have to type, the better._

<details>
  <summary>Check how that would look</summary>

```html
<$ characterTabs(personality, social) $>
<$_ slot personality $>
<h2>{{ 'person.personality_characteristics'|trans({},'presentation') }}</h2>
{% if article.motivation|length > 0 %}
  <h3>{{ 'person.motivation'|trans({},'presentation') }}</h3>
  <p>{{ article.motivation|BBcode }}</p>
{% endif %}
{% if article.savviesIneptitudes|length > 0 %}
  <h3>{{ 'person.savvies_ineptitudes'|trans({},'presentation') }}</h3>
  <p>{{ article.savviesIneptitudes|BBcode }}</p>
{% endif %}
<$_ endslot $>
<$_ slot social $>
<h2>{{ 'person.social'|trans({},'presentation') }}</h2>
{% if article.relations|length > 0 %}
  <h3>{{ 'person.contacts_relations'|trans({},'presentation') }}</h3>
  <p>{{ article.relations|BBcode }}</p>
{% endif %}
{% if article.family|length > 0 %}
  <h3>{{ 'person.family_ties'|trans({},'presentation') }}</h3>
  <p>{{ article.family|BBcode }}</p>
{% endif %}
<$_ endslot $>
<$ endslots $>
```
</details>

### The importance of whitespace

When you write your Twig template, you'll likely use indentation to create a tree-like structure. Each time an element has children, those children have a greater indent than their parent:

```html
<div class="row">
  <div class="col-md-8">
    <h2></h2>
  </div>
</div>
```

For HTML, the indent is optional. For slots, the indent is required (or at least strongly recommended). The example below illustrates having a function call with a slot that's also duplicated as a child: 

```html
<$ functionCall(slot1) $>
<$_ slot slot1 $>
<div class="functionCall1">
  <$ functionCall(slot1) $>
  <$_ slot slot1 $>
  <div class="functionCall2">
    Note the change in indent.
  </div>
  <$ endslots $>
</div>
<$ endslots $>
```

The CLI looks for the function call with the highest amount of indent and calls that function first. So let's assume `functionCall` is implemented like this:

```html
<$ function functionCall(children) $>
<$= children $>
```

Then the CLI will create an intermediate template where the most indented function call is replaced:

```html
<$ functionCall(slot1) $>
<$_ slot slot1 $>
<div class="functionCall1">
  <div class="functionCall2">
    Note the change in indent.
  </div>
</div>
<$ endslots $>
```

Then it will move on to the top-most `functionCall` and replace that to generate the output:

```html
<div class="functionCall1">
  <div class="functionCall2">
    Note the change in indent.
  </div>
</div>
```

When you don't use whitespace, the CLI will call function from bottom to top (and right to left), in a best-effort to replace functions in the proper order.

## Advanced usage

So let's look at an example that puts everything together.

### Setup

This is the `articleLink` function definition:
```html
<$ function articleLink(article, world, children) $>
<a
  href="{{ path('presentation_article', {
    'articleslug': <$= article $>.slug,
    'worldslug': <$= world $>.slug
  }) }}"
  class="article-link tooltipstered"
  data-article-id="{{ <$= article $>.id }}"
  data-article="{{ <$= article $>.id }}"
  data-article-privacy="{{ <$= article $>.state }}"
  data-template-type="{{ <$= article $>.slug|split('-')|last }}"
>
  <$= children $>
</a>
```
It is very similar to the example before, but I've added a 3rd parameter called `children`. It allows us to use single-line Twig templating or a slot to specify the contents of the anchor tag, making the function very flexible. Any time we want to link to an article, we can use this function, regardless of what the content of the anchor should be. It does one thing, and it does it well.

Because of the 3rd parameter, we also need to update `articleLinkWithEdit` accordingly:
```html
<$ function articleLinkWithEdit(article, world, children) $>
<$ articleLink(article, world, children) $>
<a
  href="/world/{{ <$= article $>.slug|split('-')|last }}/{{ <$= article $>.id }}/edit"
  class="world-editor-link btn btn-xs btn-opaque btn-default"
  style="display: none;"
>
  <i class="fas fa-pencil" aria-hidden="true"></i>
</a>
```
We're using the good-looking "pass-through" parameter style, because `children` can be a slot and could otherwise break the `articleLink` function call.

Our last function is `articleRow`:
```html
<$ function articleRow(article, world, label, content) $>
<dt>
  <$= label $>
</dt>
<dd>
  <$ articleLinkWithEdit(article, world, content) $>
</dd>
```
Note how we put the `label` and `articleLinkWithEdit` function call on their own line. Because it will (potentially) be replaced with a multi-line HTML snippet, this creates the most pretty-printed output.

So now that we have our function definitions, what can we do with it?

### Article link examples
1. A link to the species of the article, using the title of the article as the link text.
```html
<$ articleLink(article.species, article.world, {{ article.species }}) $>
```
<details>
  <summary>Check the Twig template output</summary>

```html
<a
  href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
  class="article-link tooltipstered"
  data-article-id="{{ article.species.id }}"
  data-article="{{ article.species.id }}"
  data-article-privacy="{{ article.species.state }}"
  data-template-type="{{ article.species.slug|split('-')|last }}"
>
  {{ article.species }}
</a>
```
</details>

2. Mostly the same as 1, but this time the link text is lower-cased, e.g. instead of Elf, it would say elf.
```html
<$ articleLink(article.species, article.world, {{ article.species|lower }}) $>
```
Using the lower-case can be interesting if you want to write a succinct intro line with pertinent details, without everything starting with a capital letter.

<details>
  <summary>Check the Twig template output</summary>

```html
<a
  href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
  class="article-link tooltipstered"
  data-article-id="{{ article.species.id }}"
  data-article="{{ article.species.id }}"
  data-article-privacy="{{ article.species.state }}"
  data-template-type="{{ article.species.slug|split('-')|last }}"
>
  {{ article.species|lower }}
</a>
```
</details>

### Simplistic article row example
3. An article row with plain-text label and single-line Twig template.
```html
<$ articleRow(article.species, article.world, Species, {{ article.species }}) $>
```
<details>
  <summary>Check the Twig template output</summary>

```html
<dt>
  Species
</dt>
<dd>
  <a
    href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
    class="article-link tooltipstered"
    data-article-id="{{ article.species.id }}"
    data-article="{{ article.species.id }}"
    data-article-privacy="{{ article.species.state }}"
    data-template-type="{{ article.species.slug|split('-')|last }}"
  >
    {{ article.species }}
  </a>
  <a
    href="/world/{{ article.species.slug|split('-')|last }}/{{ article.species.id }}/edit"
    class="world-editor-link btn btn-xs btn-opaque btn-default"
    style="display: none;"
  >
    <i class="fas fa-pencil" aria-hidden="true"></i>
  </a>
</dd>
```
</details>

### Article row with slot
4. An article row with label determined by World Anvil's translation for species-type articles
```html
<$ articleRow(article.species, article.world, label, {{ article.species }}) $>
<$_ slot label $>
{{ 'person.species'|trans({}, 'presentation') }}
<$ endslots $>
```
Note that because we have `()` when using `trans`, it needs to be a slot.

<details>
  <summary>Check the Twig template output</summary>

```html
<dt>
  {{ 'person.species'|trans({}, 'presentation') }}
</dt>
<dd>
  <a
    href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
    class="article-link tooltipstered"
    data-article-id="{{ article.species.id }}"
    data-article="{{ article.species.id }}"
    data-article-privacy="{{ article.species.state }}"
    data-template-type="{{ article.species.slug|split('-')|last }}"
  >
    {{ article.species }}
  </a>
  <a
    href="/world/{{ article.species.slug|split('-')|last }}/{{ article.species.id }}/edit"
    class="world-editor-link btn btn-xs btn-opaque btn-default"
    style="display: none;"
  >
    <i class="fas fa-pencil" aria-hidden="true"></i>
  </a>
</dd>
```
</details>

### Article row with Twig templating
5. An article row with Twig templating to determine the label
```html
<$ articleRow(article.species, article.world, label, {{ article.species }}) $>
<$_ slot label $>
{% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Elf|Half-Orc|Dragonborn)/' %}
Race
{% else %}
Species
{% endif %}
<$ endslots $>
```

<details>
  <summary>Check the Twig template output</summary>

```html
<dt>
  {% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Elf|Half-Orc|Dragonborn)/' %}
  Race
  {% else %}
  Species
  {% endif %}
</dt>
<dd>
  <a
    href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
    class="article-link tooltipstered"
    data-article-id="{{ article.species.id }}"
    data-article="{{ article.species.id }}"
    data-article-privacy="{{ article.species.state }}"
    data-template-type="{{ article.species.slug|split('-')|last }}"
  >
    {{ article.species }}
  </a>
  <a
    href="/world/{{ article.species.slug|split('-')|last }}/{{ article.species.id }}/edit"
    class="world-editor-link btn btn-xs btn-opaque btn-default"
    style="display: none;"
  >
    <i class="fas fa-pencil" aria-hidden="true"></i>
  </a>
</dd>
```
</details>

### Article row with function call
6. An article row with a function to determine the label
Translation convenience function definition:
```html
<$ function t(key) $>
{{ '<$= key $>'|trans({}, 'presentation') }}
```

Template:
```html
<$ articleRow(article.species, article.world, label, {{ article.species }}) $>
<$_ slot label $>
<$ t(person.species) $>
<$ endslots $>
```

<details>
  <summary>Check the Twig template output</summary>

```html
<dt>
  {{ 'person.species'|trans({}, 'presentation') }}
</dt>
<dd>
  <a
    href="{{ path('presentation_article', {
    'articleslug': article.species.slug,
    'worldslug': article.world.slug
  }) }}"
    class="article-link tooltipstered"
    data-article-id="{{ article.species.id }}"
    data-article="{{ article.species.id }}"
    data-article-privacy="{{ article.species.state }}"
    data-template-type="{{ article.species.slug|split('-')|last }}"
  >
    {{ article.species }}
  </a>
  <a
    href="/world/{{ article.species.slug|split('-')|last }}/{{ article.species.id }}/edit"
    class="world-editor-link btn btn-xs btn-opaque btn-default"
    style="display: none;"
  >
    <i class="fas fa-pencil" aria-hidden="true"></i>
  </a>
</dd>
```
</details>

Just a quick reminder about the function call order:
1. Even though `t(person.species)` lacks indenting, the CLI will call it first. After all, it works from right to left, then bottom to top.
2. So when it comes time to call `articleRow`, `t(person.species)` will already have been replaced with `{{ 'person.species'|trans({}, 'presentation') }}`.
