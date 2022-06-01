import * as fs from 'node:fs';
import _ from 'lodash';
import { buildTree } from './builder.js';

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isFileExists = (path1, path2) => fs.existsSync(path1) && fs.existsSync(path2);

const getSortedObjectKeysByAsc = (object) => _.sortBy(Object.keys(object));

const compare = (obj1, obj2) => {
  const mergedObject = { ...obj1, ...obj2 };
  const keys = getSortedObjectKeysByAsc(mergedObject);
  const res = keys
    .reduce((acc, key) => {
      const isBothObjectsHasKey = hasKey(obj1, key) && hasKey(obj2, key);
      const isOnlyFirstObjectHasKey = !hasKey(obj1, key) && hasKey(obj2, key);
      const isOnlySecondObjectHasKey = hasKey(obj1, key) && !hasKey(obj2, key);
      if (isOnlySecondObjectHasKey) {
        acc.push(`- ${key}: ${obj1[key]}`);
      }
      if (isOnlyFirstObjectHasKey) {
        acc.push(`+ ${key}: ${obj2[key]}`);
      }
      if (isBothObjectsHasKey) {
        if (obj1[key] === obj2[key]) {
          acc.push(`  ${key}: ${obj1[key]}`);
        }
        if (obj1[key] !== obj2[key]) {
          acc.push(`- ${key}: ${obj1[key]}`);
          acc.push(`+ ${key}: ${obj2[key]}`);
        }
      }
      return acc;
    }, [])
    .join('\n');
  return `\n${res}`;
};

function readAndCompareFiles() {
  const [path1, path2] = this.args;
  if (isFileExists(path1, path2)) {
    const [obj1, obj2] = buildTree(path1, path2);
    const heh = compare(obj1, obj2);
    console.log("heh", heh);
    return heh;
  }
  return {};
}

export { hasKey, readAndCompareFiles, compare };
