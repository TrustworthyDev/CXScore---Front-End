import { isNil } from "ramda";

export const isDefined = <T>(t: T | undefined | null): t is T => !isNil(t);

export const flattenObjectTree = (
  objects: fabric.Object[]
): fabric.Object[] => {
  return objects;
};
