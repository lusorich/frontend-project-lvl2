#!/usr/bin/env node
import { program } from 'commander';
import getDiff from '../src/gendiff.js';

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
    console.log(getDiff(path1, path2, formatter));
  });

program.parse(process.argv);
