type Indexed<T = unknown> = {
  [key in string]: T;
};

export function merge(
  target: Indexed,
  source: Indexed
): Indexed {
  for (const key in source) {
    if (!source.hasOwnProperty(key)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = target[key];

    try {
      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        sourceValue.constructor === Object &&
        targetValue &&
        typeof targetValue === 'object' &&
        targetValue.constructor === Object
      ) {
        target[key] = merge(targetValue as Indexed, sourceValue as Indexed);
      } else {
        target[key] = sourceValue;
      }
    } catch {
      target[key] = sourceValue;
    }
  }

  return target;
}
