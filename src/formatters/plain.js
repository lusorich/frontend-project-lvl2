import _ from 'lodash';

const getValueTxt = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const plain = (tree) => {
  const iter = (node, path) => Object.entries(node).flatMap(([key, item]) => {
    const newPath = `${path ? `${path}.` : ''}${key}`;
    if (item && item.type && item.type !== 'equal') {
      if (item.type === 'add') {
        return `Property '${newPath}' was added with value: ${getValueTxt(
          item.value,
        )}`;
      }
      if (item.type === 'remove') {
        return `Property '${newPath}' was removed`;
      }
      if (item.type === 'update') {
        const [oldValue, newValue] = item.value;
        return `Property '${newPath}' was updated. From ${getValueTxt(
          oldValue,
        )} to ${getValueTxt(newValue)}`;
      }
    }
    if (item && item.value && typeof _.isObject(item.value)) {
      return iter(item.value, newPath);
    }
    return [];
  });

  return iter(tree, '').join('\n');
};

export { getValueTxt, plain };
