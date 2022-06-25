import { readFileSync } from 'fs';
import { extname } from 'path';
import parser from './parsers.js';

export default (path1, path2) => {
  const file1 = readFileSync(path1);
  const file2 = readFileSync(path2);
  return [
    parser(extname(path1)).parse(file1),
    parser(extname(path2)).parse(file2),
  ];
};
