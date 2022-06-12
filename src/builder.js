import * as fs from 'node:fs';
import * as path from 'node:path';
import parser from './parsers.js';

export default (path1, path2) => {
  const file1 = fs.readFileSync(path1);
  const file2 = fs.readFileSync(path2);
  return [
    parser(path.extname(path1)).parse(file1),
    parser(path.extname(path2)).parse(file2),
  ];
};
