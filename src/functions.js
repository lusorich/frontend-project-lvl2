import _ from 'lodash';

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const getSortedObjectKeysByAsc = (object) => _.sortBy(Object.keys(object));

const getDiffObj = (type, value) => ({ type, value });

const getDiff = (obj1, obj2) => {
  const mergedObj = {
    ...obj1,
    ...obj2,
  };
  const keys = getSortedObjectKeysByAsc(mergedObj);

  return keys.reduce((acc, key) => {
    const isOnlyFirstObjectHasKey = hasKey(obj1, key) && !hasKey(obj2, key);
    const isOnlySecondObjectHasKey = !hasKey(obj1, key) && hasKey(obj2, key);
    const isBothObjectHasKey = hasKey(obj1, key) && hasKey(obj2, key);

    if (isOnlyFirstObjectHasKey) {
      return {
        ...acc,
        [key]: getDiffObj('remove', obj1[key]),
      };
    }
    if (isOnlySecondObjectHasKey) {
      return {
        ...acc,
        [key]: getDiffObj('add', obj2[key]),
      };
    }
    if (isBothObjectHasKey) {
      if (obj1[key] === obj2[key]) {
        return {
          ...acc,
          [key]: getDiffObj('equal', obj1[key]),
        };
      }
      if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        return {
          ...acc,
          [key]: getDiffObj('equal', getDiff(obj1[key], obj2[key])),
        };
      }
      if (obj1[key] !== obj2[key]) {
        return {
          ...acc,
          [key]: getDiffObj('update', [obj1[key], obj2[key]]),
        };
      }
    }
    return acc;
  }, {});
};

export { hasKey, getDiff };
