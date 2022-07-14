const { parseTwigFunction } = require('../parseTwigFunctions');

describe('parseTwigFunction', () => {
  test('should throw when function definition is missing', () => {
    expect(() => parseTwigFunction('', 'test.twig'))
      .toThrow('Twig function "test.twig" doesn\'t have function definition specific. Please add `<$ function funcName(param1, param2) $>` to the top of the file.')
  });

  test('should split function definition and function body', () => {
    const twigFunc = `<$ function funcName(param1, param2) $>
<div></div>`;
    const actual = parseTwigFunction(twigFunc, 'funcName.twig');
    const expected = {
      name: 'funcName',
      fileName: 'funcName.twig',
      params: ['param1', 'param2'],
      content: '<div></div>',
    };

    expect(actual).toEqual(expected);
  });

  test('should support functions with no parameters', () => {
    const twigFunc = `<$ function snippet() $>
<div>Snippet</div>`;
    const actual = parseTwigFunction(twigFunc, 'snippet.twig');
    const expected = {
      name: 'snippet',
      fileName: 'snippet.twig',
      params: [],
      content: '<div>Snippet</div>',
    };

    expect(actual).toEqual(expected);
  });
})