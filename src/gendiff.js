import { existsSync } from 'fs';
import buildTree from './builder.js';
import formatters from './formatters/index.js';
import { compare } from './functions.js';

const isFileExists = (...paths) => paths.filter((p) => existsSync(p)).length === paths.length;

export default (path1, path2, formatter = 'stylish') => {
  if (isFileExists(path1, path2)) {
    const [obj1, obj2] = buildTree(path1, path2);
    const diffTree = compare(obj1, obj2);
    const result = formatters(formatter).format(diffTree);
    return result;
  }
  return {};
};
