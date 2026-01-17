type Indexed<T = unknown> = {
  [key in string]: T;
};

function isEqual(a: object, b: object): boolean {
  if (a === b) {
    return true;
  }

  const objA = a as Indexed;
  const objB = b as Indexed;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!(key in objB)) {
      return false;
    }

    const valueA = objA[key];
    const valueB = objB[key];

    if (
      typeof valueA === 'object' &&
      valueA !== null &&
      typeof valueB === 'object' &&
      valueB !== null
    ) {
      if (!isEqual(valueA, valueB)) {
        return false;
      }
    } else {
      if (!Object.is(valueA, valueB)) {
        return false;
      }
    }
  }

  return true;
}

export default isEqual;
