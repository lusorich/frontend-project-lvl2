import { stylish } from './stylish.js';
import { plain } from './plain.js';

export default (formatter) => {
  switch (formatter) {
    case 'stylish': {
      return {
        format: (tree) => stylish(tree),
      };
    }
    case 'plain': {
      return {
        format: (tree) => plain(tree),
      };
    }
    case 'json': {
      return {
        format: (tree) => JSON.stringify(tree),
      };
    }
    default:
      throw new Error('Formatter not allowed');
  }
};
