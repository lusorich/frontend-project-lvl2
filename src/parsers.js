import * as yamlParser from 'js-yaml';

const parser = (file, ext) => {
  switch (ext) {
    case '.yaml':
    case '.yml': {
      return yamlParser.load(file);
    }
    case '.json': {
      return JSON.parse(file);
    }
    default:
      return {};
  }
};

export { parser };
