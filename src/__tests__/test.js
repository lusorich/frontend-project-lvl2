import { hasKey } from '../functions.js';

describe('hasKey function testing', () => {
  test('hasKey return true, if the object contains a key', () => {
    const object = {
      name: 'Matthew',
    };
    expect(hasKey(object, 'name')).toBeTruthy();
  });
  test('hasKey return false, if the object does not contains a key', () => {
    const object = {
      name2: 'Matthew',
    };
    expect(hasKey(object, 'name')).toBeFalsy();
  });
  test('hasKey return false, if not an object is passed', () => {
    const str = 'test';
    const num = 33;
    expect(hasKey(str, 'name')).toBeFalsy();
    expect(hasKey(num, 'name')).toBeFalsy();
  });
});
