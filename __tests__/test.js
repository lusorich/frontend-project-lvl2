import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yamlParser from 'js-yaml';
import { hasKey, compare } from '../src/functions.js';
import buildTree from '../src/builder.js';
import parser from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../', '__fixtures__', filename);
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

describe('parser testing', () => {
  test('depending on the file extension, the correct type is returned', () => {
    const parser1 = parser(path.extname('file1.yaml'));
    const parser2 = parser(path.extname('file1.yml'));
    const parser3 = parser(path.extname('file1.json'));

    expect(parser1).toHaveProperty('type', 'yaml');
    expect(parser2).toHaveProperty('type', 'yaml');
    expect(parser3).toHaveProperty('type', 'json');
  });
  test('depending on the file extension, the correct parser is returned', () => {
    const parser1 = parser(path.extname('file1.yaml'));
    const parser2 = parser(path.extname('file1.json'));

    const [file1, file2] = [readFile('file1.yaml'), readFile('file2.json')];

    const expectedYamlParse = yamlParser.load(file1);
    const expectedJsonParse = JSON.parse(file2);

    const parseFile1 = parser1.parse(file1);
    const parseFile2 = parser2.parse(file2);

    expect(parseFile1).toEqual(expectedYamlParse);
    expect(parseFile2).toEqual(expectedJsonParse);
  });
});

describe('build tree testing', () => {
  test('returns an array with two trees', () => {
    const path1 = getFixturePath('file1.json');
    const path2 = getFixturePath('file2.json');

    expect(buildTree(path1, path2)).toHaveLength(2);
  });
});

describe('compare testing', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const [obj1, obj2] = buildTree(path1, path2);

  test('returns the type "equal" if the primitives are equal', () => {
    const valueFromObj1 = obj1.common.setting1;
    const valueFromObj2 = obj2.common.setting1;
    const isEqualThanEqualType = valueFromObj1 === valueFromObj2;
    const compareResult = compare(obj1, obj2);
    const resultDiffTypeOfValue = compareResult.common.value.setting1.type;

    expect(isEqualThanEqualType).toBeTruthy();
    expect(resultDiffTypeOfValue).toEqual('equal');
  });

  test('returns type "miss" if key contained in only first object', () => {
    const isOnlyFirstObjectHasKey = hasKey(obj1.common, 'setting2')
      && !hasKey(obj2.common, 'setting2');
    const compareResult = compare(obj1, obj2);
    const resultDiffTypeOfValue = compareResult.common.value.setting2.type;

    expect(isOnlyFirstObjectHasKey).toBeTruthy();
    expect(resultDiffTypeOfValue).toEqual('remove');
  });

  test('returns type "add" if key contained in only second object', () => {
    const isOnlySecondObjectHasKey = !hasKey(obj1.common, 'setting4') && hasKey(obj2.common, 'setting4');
    const compareResult = compare(obj1, obj2);
    const resultDiffTypeOfValue = compareResult.common.value.setting4.type;

    expect(isOnlySecondObjectHasKey).toBeTruthy();
    expect(resultDiffTypeOfValue).toEqual('add');
  });

  test('returns type "diff", if key contained in both object but difference value', () => {
    const valueFromObj1 = obj1.common.setting3;
    const valueFromObj2 = obj2.common.setting3;
    const allObjectsHasKey = hasKey(obj1.common, 'setting3') && hasKey(obj1.common, 'setting3');
    const compareResult = compare(obj1, obj2);
    const resultDiffTypeOfValue = compareResult.common.value.setting3.type;

    expect(allObjectsHasKey).toBeTruthy();
    expect(valueFromObj1).not.toEqual(valueFromObj2);
    expect(resultDiffTypeOfValue).toEqual('update');
  });
});
