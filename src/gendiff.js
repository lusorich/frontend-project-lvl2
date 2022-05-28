import { program } from "commander";

export default () => {
  program
    .name("gendiff")
    .description("Compares two configuration files and shows a difference.")
    .version("0.0.1")
    .argument("<filepath1>")
    .argument("<filepath2>")
    .option("-f, --format <type>", "output format");

  program.parse();
};

const hasKey = (obj, key) => (obj.hasOwnProperty(key) ? true : false);

const compare = (file1, file2) => {
  const mergedObject = Object.assign({ ...json1 }, { ...json2 });
  const keys = Object.keys(mergedObject).sort();
  const res = keys.reduce((acc, key) => {
    const isBothObjectsHasKey = hasKey(json1, key) && hasKey(json2, key);
    const isOnlyFirstObjectHasKey = !hasKey(json1, key) && hasKey(json2, key);
    const isOnlySecondObjectHasKey = hasKey(json1, key) && !hasKey(json2, key);
    if (isOnlySecondObjectHasKey) {
      acc.push(`- ${key}: ${json1[key]}`);
    }
    if (isOnlyFirstObjectHasKey) {
      acc.push(`+ ${key}: ${json2[key]}`);
    }
    if (isBothObjectsHasKey) {
      if (json1[key] === json2[key]) {
        acc.push(`  ${key}: ${json1[key]}`);
      }
      if (json1[key] !== json2[key]) {
        acc.push(`- ${key}: ${json1[key]}`);
        acc.push(`+ ${key}: ${json2[key]}`);
      }
    }
    return acc;
  }, []).join('\n');
  return res;
};
