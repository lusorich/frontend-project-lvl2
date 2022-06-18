import * as fs from 'node:fs';
import _ from 'lodash';
import buildTree from './builder.js';
import { stylish } from './formatters/stylish.js';

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isFileExists = (...paths) => paths.filter((p) => fs.existsSync(p)).length === paths.length;
const getSortedObjectKeysByAsc = (object) => _.sortBy(Object.keys(object));

const getDiffObj = (type, value) => ({ type, value });

const compare = (obj1, obj2) => {
  const mergedObj = {
    ...obj1,
    ...obj2,
  };
  const keys = getSortedObjectKeysByAsc(mergedObj);

  return keys.reduce((acc, key) => {
    const isOnlyFirstObjectHasKey = hasKey(obj1, key) && !hasKey(obj2, key);
    const isOnlySecondObjectHasKey = !hasKey(obj1, key) && hasKey(obj2, key);
    const isBothObjectHasKey = hasKey(obj1, key) && hasKey(obj2, key);

    if (isOnlyFirstObjectHasKey) {
      return {
        ...acc,
        [key]: getDiffObj('miss', obj1[key]),
      };
    }
    if (isOnlySecondObjectHasKey) {
      return {
        ...acc,
        [key]: getDiffObj('add', obj2[key]),
      };
    }
    if (isBothObjectHasKey) {
      if (obj1[key] === obj2[key]) {
        return {
          ...acc,
          [key]: getDiffObj('equal', obj1[key]),
        };
      }
      if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        return {
          ...acc,
          [key]: getDiffObj('equal', compare(obj1[key], obj2[key])),
        };
      }
      if (obj1[key] !== obj2[key]) {
        return {
          ...acc,
          [key]: getDiffObj('diff', [obj1[key], obj2[key]]),
        };
      }
    }
    return acc;
  }, {});
};

function readAndCompareFiles(path1, path2, formatter) {
  if (isFileExists(path1, path2)) {
    const [obj1, obj2] = buildTree(path1, path2);
    const diffTree = compare(obj1, obj2);
    switch (formatter) {
      case 'stylish': {
        console.log(stylish(diffTree));
        return stylish(diffTree);
      }
      default: return '';
    }
  }
  return {};
}

export { hasKey, readAndCompareFiles, compare };
