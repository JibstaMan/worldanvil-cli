const interpolate = require('../interpolate');

const FUNCTIONS = {
  snippet: {
    // function calls without parameters
    name: 'snippet',
    fileName: 'snippet.twig',
    params: [],
    content: '<span>Content without variables</span>',
  },
  keyValue: {
    // Simplistic: replace call with body (multi-line params)
    name: 'keyValue',
    fileName: 'keyValue.twig',
    params: ['key', 'value'],
    content: `<$= key $>: <$= value $>`,
  },
  articleLink: {
    // Realistic: replace calls with body
    name: 'articleLink',
    fileName: 'articleLink.twig',
    params: ['article', 'world'],
    content: `<a
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
</a>`
  },
  articleLink2: {
    // Realistic: single-line Twig template param, multiple function calls, nested slots
    name: 'articleLink2',
    fileName: 'articleLink2.twig',
    params: ['article', 'world', 'children'],
    content: `<a
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
</a>`
  },
  articleLinkWithEdit: {
    // Realistic: function calls within functions
    name: 'articleLinkWithEdit',
    fileName: 'articleLinkWithEdit.twig',
    params: ['article', 'world'],
    content: `<$ articleLink(article, world) $>
<a
  href="/world/{{ <$= article $>.slug|split('-')|last }}/{{ <$= article $>.id }}/edit"
  class="world-editor-link btn btn-xs btn-opaque btn-default"
  style="display: none;"
>
  <i class="fas fa-pencil" aria-hidden="true"></i>
</a>`,
  },
  characterTabs: {
    // "Realistic": slots, slots & concrete params, nested slots
    name: 'characterTabs',
    fileName: 'characterTabs.twig',
    params: ['personality', 'social'],
    content: `<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="personality">
    <$= personality $>
  </div>
  <div role="tabpanel" class="tab-pane active" id="social">
    <$= social $>
  </div>
</div>`,
  },
  sidebarRow: {
    // Realistic: slots with function calls, slots preserve whitespace, nested slots
    name: 'sidebarRow',
    fileName: 'sidebarRow.twig',
    params: ['key', 'value'],
    content: `<div class="visibility-toggler">
  <div class="sidebar-row">
    <div class="sidebar-row-key">
      <$= key $>
    </div>
    <div class="sidebar-row-value">
      <$= value $>
    </div>
  </div>
</div>`,
  },
  sidebarRowNested: {
    // testing "Pass-though parameters"
    name: 'sidebarRowNested',
    fileName: 'sidebarRowNested.twig',
    params: ['key', 'value'],
    content: `<div class="nested">
  <$ sidebarRow(key, value) $>
</div>`
  },
  unresolvedParam: {
    name: 'unresolvedParam',
    fileName: 'unresolvedParam.twig',
    params: ['param'],
    content: `<div><$= param $></div>
<div><$= extraParam $></div>`
  },
  recursive: {
    name: 'recursive',
    fileName: 'recursive.twig',
    params: [],
    content: '<div><$ recursive() $></div>',
  },
  circular1: {
    name: 'circular1',
    fileName: 'circular1.twig',
    params: [],
    content: '<div><$ circular2() $></div>',
  },
  circular2: {
    name: 'circular2',
    fileName: 'circular2.twig',
    params: [],
    content: '<div><$ circular3() $></div>',
  },
  circular3: {
    name: 'circular3',
    fileName: 'circular3.twig',
    params: [],
    content: '<div><$ circular1() $></div>',
  },
};

describe('interpolate', () => {

  test('should return as-is when there are no function calls', () => {
    const template = `<div class="row ">
  <div class="col-md-8 article-content-left ">
    {% if article.firstname|length > 0 or article.honorific|length > 0  or article.middlename|length > 0  or article.lastname|length > 0  or article.nickname|length > 0  %}
      <h3 class="person-fullname">
        {{ article.honorific|BBcode }} {{ article.firstname|BBcode }} {{ article.middlename|BBcode }} {{ article.lastname|BBcode }}
      </h3>
    {% endif %}
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'noFunctionCalls.twig');
    const expected = template;
    expect(actual).toBe(expected);
  });

  test('should replace function calls with the function body', () => {
    const template = `<div class="col-md-4">
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
</div>`;

    const expected = `<div class="col-md-4">
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
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'simpleFunctionCalls.twig');
    expect(actual).toBe(expected);
  });

  test('should support functions without parameters', () => {
    const template = `<div>
  <$ snippet() $>
</div>`;

    const expected = `<div>
  <span>Content without variables</span>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'noParams.twig');
    expect(actual).toBe(expected);
  });

  test('should support function calls with multi-line parameter lists', () => {
    const template = `<$ keyValue(
      Species,
      {{ article.species }},
    ) $>`;

    const actual = interpolate(template, FUNCTIONS, 'multiLineParams.twig');
    const expected = 'Species: {{ article.species }}';

    expect(actual).toBe(expected);
  });

  test('should support function calls with single-line Twig templating values', () => {
    const template = `<div class="col-md-4">
  <div class="panel panel-default card mb-3">
    <div class="panel-body card-body">
      {{ article.sidepanelcontenttop|BBcode }}
      <dl>
        <dt>{{ 'person.species'|trans({}, 'presentation') }}</dt>
        <dd>
          <$ articleLink2(article.species, article.world, {{ article.species }}) $>
        </dd>
      </dl>
    </div>
  </div>
</div>`;

    const expected = `<div class="col-md-4">
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
      </dl>
    </div>
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'simpleFunctionCalls.twig');
    expect(actual).toBe(expected);
  })

  test('should allow functions to call other functions', () => {
    const template = `<div class="col-md-4">
  <div class="panel panel-default card mb-3">
    <div class="panel-body card-body">
      {{ article.sidepanelcontenttop|BBcode }}
      <dl>
        <dt>{{ 'person.species'|trans({}, 'presentation') }}</dt>
        <dd>
          <$ articleLinkWithEdit(article.species, article.world) $>
        </dd>
        <dt>{{ 'person.current_location'|trans({}, 'presentation') }}</dt>
        <dd>
          <$ articleLinkWithEdit(article.currentLocation, article.world) $>
        </dd>
      </dl>
    </div>
  </div>
</div>`;

    const expected = `<div class="col-md-4">
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
          <a
            href="/world/{{ article.species.slug|split('-')|last }}/{{ article.species.id }}/edit"
            class="world-editor-link btn btn-xs btn-opaque btn-default"
            style="display: none;"
          >
            <i class="fas fa-pencil" aria-hidden="true"></i>
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
          <a
            href="/world/{{ article.currentLocation.slug|split('-')|last }}/{{ article.currentLocation.id }}/edit"
            class="world-editor-link btn btn-xs btn-opaque btn-default"
            style="display: none;"
          >
            <i class="fas fa-pencil" aria-hidden="true"></i>
          </a>
        </dd>
      </dl>
    </div>
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'simpleFunctionCalls.twig');
    expect(actual).toBe(expected);
  });

  test('should support slots', () => {
    const template = `<$ characterTabs(personality, social) $>
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
<$ endslots $>`;

    const expected = `<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="personality">
    <h2>{{ 'person.personality_characteristics'|trans({},'presentation') }}</h2>
    {% if article.motivation|length > 0 %}
      <h3>{{ 'person.motivation'|trans({},'presentation') }}</h3>
      <p>{{ article.motivation|BBcode }}</p>
    {% endif %}
    {% if article.savviesIneptitudes|length > 0 %}
      <h3>{{ 'person.savvies_ineptitudes'|trans({},'presentation') }}</h3>
      <p>{{ article.savviesIneptitudes|BBcode }}</p>
    {% endif %}
  </div>
  <div role="tabpanel" class="tab-pane active" id="social">
    <h2>{{ 'person.social'|trans({},'presentation') }}</h2>
    {% if article.relations|length > 0 %}
      <h3>{{ 'person.contacts_relations'|trans({},'presentation') }}</h3>
      <p>{{ article.relations|BBcode }}</p>
    {% endif %}
    {% if article.family|length > 0 %}
      <h3>{{ 'person.family_ties'|trans({},'presentation') }}</h3>
      <p>{{ article.family|BBcode }}</p>
    {% endif %}
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'functionWithSlots');
    expect(actual).toBe(expected);
  });

  test('should support slots and concrete parameters together', () => {
    const template = `<$ characterTabs(None whatsoever, social) $>
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
<$ endslots $>`;

    const expected = `<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="personality">
    None whatsoever
  </div>
  <div role="tabpanel" class="tab-pane active" id="social">
    <h2>{{ 'person.social'|trans({},'presentation') }}</h2>
    {% if article.relations|length > 0 %}
      <h3>{{ 'person.contacts_relations'|trans({},'presentation') }}</h3>
      <p>{{ article.relations|BBcode }}</p>
    {% endif %}
    {% if article.family|length > 0 %}
      <h3>{{ 'person.family_ties'|trans({},'presentation') }}</h3>
      <p>{{ article.family|BBcode }}</p>
    {% endif %}
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'functionWithSlots');
    expect(actual).toBe(expected);
  });

  test('should support slots with function calls', () => {
    const template = `<$ sidebarRow(Species, value) $>
<$_ slot value $>
<$ articleLinkWithEdit(article.species, article.world) $>
<$ endslots $>`;

    const expected = `<div class="visibility-toggler">
  <div class="sidebar-row">
    <div class="sidebar-row-key">
      Species
    </div>
    <div class="sidebar-row-value">
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
    </div>
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'slotsWithFunction');
    expect(actual).toBe(expected);
  });

  test('should support slots with function calls, preserving template whitespace', () => {
    const template = `<div>
  {% if article.species|length > 0 %}
    <$ sidebarRow(key, value) $>
    <$_ slot key $>
    {% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Orc|Dragonborn)/' %}
      Race
    {% else %}
      Species
    {% endif %}
    <$_ slot value $>
    <$ articleLinkWithEdit(article.species, article.world) $>
    <$ endslots $>
  {% endif %}
</div>`;

    const expected = `<div>
  {% if article.species|length > 0 %}
    <div class="visibility-toggler">
      <div class="sidebar-row">
        <div class="sidebar-row-key">
          {% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Orc|Dragonborn)/' %}
            Race
          {% else %}
            Species
          {% endif %}
        </div>
        <div class="sidebar-row-value">
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
        </div>
      </div>
    </div>
  {% endif %}
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'slotsWithFunction');
    expect(actual).toBe(expected);
  });

  test('should support slots with function calls, preserving template whitespace with slot indent and endslot', () => {
    const template = `<div>
  {% if article.species|length > 0 %}
    <$ sidebarRow(key, value) $>
      <$_ slot key $>
        {% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Orc|Dragonborn)/' %}
          Race
        {% else %}
          Species
        {% endif %}
      <$_ endslot $>
      <$_ slot value $>
        <$ articleLinkWithEdit(article.species, article.world) $>
      <$_ endslot $>
    <$ endslots $>
  {% endif %}
</div>`;

    const expected = `<div>
  {% if article.species|length > 0 %}
    <div class="visibility-toggler">
      <div class="sidebar-row">
        <div class="sidebar-row-key">
          {% if article.species matches '/(Human|Elf|Dwarf|Halfling|Gnome|Half-Orc|Dragonborn)/' %}
            Race
          {% else %}
            Species
          {% endif %}
        </div>
        <div class="sidebar-row-value">
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
        </div>
      </div>
    </div>
  {% endif %}
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'slotsWithFunction');
    expect(actual).toBe(expected);
  });

  test('should pass parameters as-is when used in functions, including slots ("pass-through parameters")', () => {
    const template = `<$ sidebarRowNested(Species, value) $>
<$_ slot value $>
<$ articleLinkWithEdit(article.species, article.world) $>
<$ endslots $>`;

    const expected = `<div class="nested">
  <div class="visibility-toggler">
    <div class="sidebar-row">
      <div class="sidebar-row-key">
        Species
      </div>
      <div class="sidebar-row-value">
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
      </div>
    </div>
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'automaticParams.twig');
    expect(actual).toBe(expected);
  });

  test('should support a template with multiple function calls, some including slots', () => {
    const template = `<$ articleLink2(article.species, article.world, children) $>
<$_ slot children $>
{{ article.species|lower }}
<$ endslots $>
<$ keyValue(Ethnicity, article.ethnicity) $>
{% include 'PresentationBundle:Helpers:relation.html.twig' with {
  'value': article.ethnicity,
  'title':'person.ethnicity',
  'article': article,'locale': locale
} only %}
<$ articleLink2(article.currentLocation, article.world, children) $>
<$_ slot children $>
{{ article.currentLocation|lower }}
<$ endslots $>`;

    const expected = `<a
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
Ethnicity: article.ethnicity
{% include 'PresentationBundle:Helpers:relation.html.twig' with {
  'value': article.ethnicity,
  'title':'person.ethnicity',
  'article': article,'locale': locale
} only %}
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
  {{ article.currentLocation|lower }}
</a>`;

    const actual = interpolate(template, FUNCTIONS, 'advancedTemplate.twig');
    expect(actual).toBe(expected);
  });

  test('should support nested slots and using same slot name', () => {
    const template = `<$ characterTabs(personality, Social) $>
<$_ slot personality $>
  <div class="personality-content">
    <$ sidebarRow(Species, value) $>
    <$_ slot value $>
      <$ articleLink2(article.species, article.world, value) $>
      <$_ slot value $>
        <span class="small">
          {{ article.species }}
        </span>
      <$ endslots $>
    <$ endslots $>
  </div>
<$ endslots $>`;

    const expected = `<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="personality">
    <div class="personality-content">
      <div class="visibility-toggler">
        <div class="sidebar-row">
          <div class="sidebar-row-key">
            Species
          </div>
          <div class="sidebar-row-value">
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
              <span class="small">
                {{ article.species }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div role="tabpanel" class="tab-pane active" id="social">
    Social
  </div>
</div>`;

    const actual = interpolate(template, FUNCTIONS, 'nestedSlots.twig');
    expect(actual).toBe(expected);
  });

  test('should ignore wrongly written function calls', () => {
    const wrongTemplates = [
      '<$ f1( $>',
      '<$ f2) $>',
      '<$ f3() >',
      '<$ f4() $',
      '<$ f5()) $>',
      '<$ f6(() $>',
    ];
    wrongTemplates.forEach((template, index) => {
      expect(interpolate(template, FUNCTIONS, `f${index}.twig`)).toBe(template);
    });
  });

  test("should throw when function is called that's not defined", () => {
    expect(() => interpolate('<$ nope() $>', FUNCTIONS, 'undefined.twig'))
      .toThrow('Twig template "undefined.twig" is using function `nope`, which hasn\'t been specified yet or was added in the wrong folder.');
  });

  test('should throw when parameters are missing', () => {
    expect(() => interpolate(`<$ keyValue(key) $>`, FUNCTIONS, 'missingParam.twig'))
      .toThrow('Twig template "missingParam.twig" is using function `keyValue`, but is missing values for the following parameters: value.');

    expect(() => interpolate(`<$ keyValue() $>`, FUNCTIONS, 'missingParam.twig'))
      .toThrow('Twig template "missingParam.twig" is using function `keyValue`, but is missing values for the following parameters: key and value.');
  });

  test('should throw when too many parameters are passed', () => {
    expect(() => interpolate(`<$ keyValue(key, value, extra) $>`, FUNCTIONS, 'tooManyParams.twig'))
      .toThrow('Twig template "tooManyParams.twig" is using function `keyValue`, but is passing 1 parameter too many.');

    expect(() => interpolate(`<$ keyValue(key, value, extra1, extra2) $>`, FUNCTIONS, 'tooManyParams.twig'))
      .toThrow('Twig template "tooManyParams.twig" is using function `keyValue`, but is passing 2 parameters too many.');
  });

  test('should throw when a parameter is used within the body, but not replaced', () => {
    expect(() => interpolate('<$ unresolvedParam(paramVal) $>', FUNCTIONS, 'unresolved.twig'))
      .toThrow('Twig function `unresolvedParam` is using a parameter `extraParam` within it that\'s not part of the function definition\'s parameter list.');
  });

  test('should throw when a slot is defined, but not part of the function call parameter list', () => {
    const template = `<$ sidebarRow(Species, Elf) $>
<$_ slot value $>
{{ article.species }}
<$ endslots $>
`;
    expect(() => interpolate(template, FUNCTIONS, 'wrongSlotDefined'))
      .toThrow('Twig function `sidebarRow` has a slot called "value" within it that\'s not part of the function call\'s parameter list.');
  });

  test('should throw when a function is called recursively', () => {
    expect(() => interpolate('<$ recursive() $>', FUNCTIONS, 'callYourself.twig'))
      .toThrow('Twig function `recursive` (see "recursive.twig") is calling itself, which is not supported.');
  });

  test('should throw when functions are called circularly', () => {
    expect(() => interpolate('<$ circular1() $>', FUNCTIONS, 'callCircular.twig'))
      .toThrow('Twig function `circular1` is part of a circular function call-stack:\n' +
        'circular1 -> circular2 -> circular3 -> circular1');
  });
});