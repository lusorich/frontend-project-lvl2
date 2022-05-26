import { program } from "commander";

export default () => {
  program
    .name("gendiff")
    .description("Compares two configuration files and shows a difference.")
    .version("0.0.1")
    .argument('<filepath1>')
    .argument('<filepath2>')
    .option('-f, --format <type>', 'output format')

  program.parse();
};
