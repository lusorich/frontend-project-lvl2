import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { hasKey, compare } from '../functions.js';
import { buildTree } from '../builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

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

describe('compare function testing', () => {
  test('the result is correct after comparing two json files', () => {
    const [obj1, obj2] = buildTree(getFixturePath('file1.json'), getFixturePath('file2.json'));
    const expectedString = '\n- follow: false\n  host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true';
    const diff = compare(obj1, obj2);
    expect(diff).toEqual(expectedString);
  });

  test('the result is correct after comparing two yaml/yml files', () => {
    const [obj1, obj2] = buildTree(
      getFixturePath('file1.yaml'),
      getFixturePath('file2.yml'),
    );
    const expectedString = '\n- follow: false\n  host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true';
    const diff = compare(obj1, obj2);
    console.log(diff);
    expect(diff).toEqual(expectedString);
  });
});
