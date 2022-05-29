import * as fs from 'node:fs';
import _ from 'lodash';

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getSortedObjectKeysByAsc = (object) => _.sortBy(Object.keys(object));

const compare = (file1, file2) => {
  const mergedObject = { ...file1, ...file2 };
  const keys = getSortedObjectKeysByAsc(mergedObject);
  const res = keys
    .reduce((acc, key) => {
      const isBothObjectsHasKey = hasKey(file1, key) && hasKey(file2, key);
      const isOnlyFirstObjectHasKey = !hasKey(file1, key) && hasKey(file2, key);
      const isOnlySecondObjectHasKey = hasKey(file1, key) && !hasKey(file2, key);
      if (isOnlySecondObjectHasKey) {
        acc.push(`- ${key}: ${file1[key]}`);
      }
      if (isOnlyFirstObjectHasKey) {
        acc.push(`+ ${key}: ${file2[key]}`);
      }
      if (isBothObjectsHasKey) {
        if (file1[key] === file2[key]) {
          acc.push(`  ${key}: ${file1[key]}`);
        }
        if (file1[key] !== file2[key]) {
          acc.push(`- ${key}: ${file1[key]}`);
          acc.push(`+ ${key}: ${file2[key]}`);
        }
      }
      return acc;
    }, [])
    .join('\n');
  return `\n${res}`;
};

function readAndCompareFiles() {
  const [path1, path2] = this.args;
  if (
    path1.endsWith('.json')
    && path2.endsWith('.json')
    && fs.existsSync(path1)
    && fs.existsSync(path2)
  ) {
    const json1 = JSON.parse(fs.readFileSync(path1));
    const json2 = JSON.parse(fs.readFileSync(path2));
    const heh = compare(json1, json2);
    console.log('heh', heh);
    return heh;
  }
  return {};
}

export { hasKey, readAndCompareFiles, compare };
