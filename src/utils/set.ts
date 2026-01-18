import { merge } from "./merge";
type Indexed<T = unknown> = {
  [key in string]: T;
};

export function set(
  target: Indexed | unknown,
  path: string,
  newValue: unknown
): Indexed | unknown {
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  if (typeof path !== 'string') {
    throw new Error('Path must be a string');
  }

  const pathKeys = path.split('.');
  const nestedStructure = pathKeys.reduceRight<Indexed>(
    (accumulator, currentKey) => ({
      [currentKey]: accumulator
    }),
    newValue as Indexed
  );

  return merge(target as Indexed, nestedStructure);
}
