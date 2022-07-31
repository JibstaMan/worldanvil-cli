const matchAll = require('../matchAll');

describe('matchAll', () => {
  it('should return simplified list of matches', () => {
    const regex = /(bla)(di)/d;
    const content = 'bladibladibladi';
    const expected = [
      ['bla'],
      ['bla'],
      ['bla'],
    ];

    const actual = matchAll(regex, content);
    expect(actual).toStrictEqual(expected);
  });

  it('should ignore the last capture group when finding subsequent matches', () => {
    const regex = /<slot>\r?\n([\w\W]+?)\r?\n(<slot>|<endslots>)/d;
    const content = `<slot>
slot1
<slot>
slot2
<endslots>`;

    const expected = [
      ['slot1'],
      ['slot2'],
    ];
    const actual = matchAll(regex, content);
    expect(actual).toStrictEqual(expected);
  });
});
