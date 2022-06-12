import * as fs from 'node:fs';
import _ from 'lodash';
import buildTree from './builder.js';

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isFileExists = (path1, path2) => fs.existsSync(path1) && fs.existsSync(path2);
const getSortedObjectKeysByAsc = (object) => _.sortBy(Object.keys(object));

const compare = (obj1, obj2) => {
  const mergedObj = {
    ...obj1,
    ...obj2,
  };

  const keys = getSortedObjectKeysByAsc(mergedObj);

  const iter = (key, val1, val2) => {
    const isBothObjectsHasKey = hasKey(obj1, key) && hasKey(obj2, key);
    const isOnlyFirstObjectHasKey = hasKey(obj1, key) && !hasKey(obj2, key);
    const isOnlySecondObjectHasKey = !hasKey(obj1, key) && hasKey(obj2, key);

    if (isOnlyFirstObjectHasKey) {
      return {
        key,
        value: val1,
        type: 'miss',
      };
    }
    if (isOnlySecondObjectHasKey) {
      return {
        key,
        value: val2,
        type: 'add',
      };
    }
    if (isBothObjectsHasKey) {
      if (obj1[key] === obj2[key]) {
        return {
          key,
          value: obj2[key],
          type: 'equal',
        };
      }
      if (obj1[key] !== obj2[key]) {
        return [
          {
            key,
            value: obj1[key],
            type: 'miss',
          },
          {
            key,
            value: obj2[key],
            type: 'add',
          },
        ];
      }
    }
    return {};
  };

  return keys
    .reduce((acc, key) => {
      const isOnlyFirstObjectHasKey = hasKey(obj1, key) && !hasKey(obj2, key);
      const isOnlySecondObjectHasKey = !hasKey(obj1, key) && hasKey(obj2, key);
      if (!_.isObject(obj1[key]) && !_.isObject(obj2[key])) {
        acc.push(iter(key, obj1[key], obj2[key]));
      } else if (isOnlyFirstObjectHasKey) {
        acc.push({
          key,
          value: compare(obj1[key] || {}, obj2[key] || {}),
          type: 'miss',
        });
      } else if (isOnlySecondObjectHasKey) {
        acc.push({
          key,
          value: compare(obj1[key] || {}, obj2[key] || {}),
          type: 'add',
        });
      } else {
        acc.push({
          key,
          value: compare(obj1[key] || {}, obj2[key] || {}),
          type: 'equal',
        });
      }
      return acc;
    }, [])
    .flat();
};

function readAndCompareFiles() {
  const [path1, path2] = this.args;
  if (isFileExists(path1, path2)) {
    const [obj1, obj2] = buildTree(path1, path2);
    const heh = compare(obj1, obj2);
    console.log("heh", heh[1].value[3]);
    return heh;
  }
  return {};
}

export { hasKey, readAndCompareFiles, compare };
