import * as yamlParser from 'js-yaml';

const parser = (ext) => {
  switch (ext) {
    case '.yaml':
    case '.yml': {
      return {
        parse: (file) => yamlParser.load(file),
        type: 'yaml',
      };
    }
    case '.json': {
      return {
        parse: (file) => JSON.parse(file),
        type: 'json',
      };
    }
    default:
      return {};
  }
};

export default parser;
