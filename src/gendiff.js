import { program } from 'commander';
import { readAndCompareFiles } from './functions.js';

export default () => {
  program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .option('-f, --format <type>', 'output format', 'stylish')
    .action((...args) => {
      const [path1, path2] = [args[0], args[1]];
      const formatter = args[2].format;
      return readAndCompareFiles(path1, path2, formatter);
    });

  program.parse();
};
