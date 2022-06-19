import _ from 'lodash';

const spacesCount = 1;
const replacer = '    ';

const getCurrentIndentsByType = (type, repeatCount) => {
  const currentIndent = replacer.repeat(repeatCount);
  const countReplacedChar = 2;
  if (type) {
    switch (type) {
      case 'add':
        return [
          `${currentIndent.slice(0, currentIndent.length - countReplacedChar)
          }+`
            + ' ',
        ];
      case 'remove':
        return [
          `${currentIndent.slice(0, currentIndent.length - countReplacedChar)
          }-`
            + ' ',
        ];
      case 'update': {
        return [
          `${currentIndent.slice(
            0,
            currentIndent.length - countReplacedChar,
          )}-` + ' ',
          `${currentIndent.slice(
            0,
            currentIndent.length - countReplacedChar,
          )}+` + ' ',
        ];
      }
      default:
        return [currentIndent];
    }
  }
  return [currentIndent];
};

const stylish = (obj) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount;
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object.keys(currentValue).map((key) => {
      const { type, value } = currentValue[key];
      const [currentIndent1, currentIndent2] = getCurrentIndentsByType(
        type,
        indentSize,
      );
      if (Array.isArray(value)) {
        const [value1, value2] = value;
        return `${currentIndent1}${key}: ${iter(
          value1,
          depth + 1,
        )}\n${currentIndent2}${key}: ${iter(value2, depth + 1)}`;
      }
      if (key !== 'type') {
        return `${currentIndent1}${key}: ${iter(
          value !== undefined ? value : currentValue[key],
          depth + 1,
        )}`;
      }
      return '';
    }).filter(Boolean);

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(obj, 1);
};

export { getCurrentIndentsByType, stylish };
