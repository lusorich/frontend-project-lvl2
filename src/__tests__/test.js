import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { hasKey, compare } from '../functions.js';

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
    const file1 = readFile('file1.json');
    const file2 = readFile('file2.json');
    const expectedString = '  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true';
    const diff = compare(file1, file2, "json");
    expect(diff).toEqual(expectedString);
  });

  test('the result is correct after comparing two yaml/yml files', () => {
    const file1 = readFile('file1.yaml');
    const file2 = readFile('file2.yml');
    const expectedString = '  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true';
    const diff = compare(file1, file2, "yml");
    console.log(diff);
    expect(diff).toEqual(expectedString);
  });
});
