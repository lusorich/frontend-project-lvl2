import * as fs from 'node:fs';
import * as path from 'node:path';
import { parser } from './parsers.js';

const buildTree = (path1, path2) => {
  const file1 = fs.readFileSync(path1);
  const file2 = fs.readFileSync(path2);
  return [
    parser(file1, path.extname(path1)),
    parser(file2, path.extname(path2)),
  ];
};

export { buildTree };
