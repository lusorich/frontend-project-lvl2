import { existsSync } from 'fs';
import buildTree from './builder.js';
import formatters from './formatters/index.js';
import { getDiff } from './functions.js';

const isFileExists = (path1, path2) => existsSync(path1) && existsSync(path2);

export default (path1, path2, formatter = 'stylish') => {
  if (isFileExists(path1, path2)) {
    const [tree1, tree2] = buildTree(path1, path2);
    const diffTree = getDiff(tree1, tree2);
    const result = formatters(formatter).format(diffTree);
    return result;
  }
  return {};
};
