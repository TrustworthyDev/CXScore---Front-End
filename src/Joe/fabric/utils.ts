const lockValuesToRestore = [
  "lockMovementX",
  "lockMovementY",
  "lockRotation",
  "lockScalingFlip",
  "lockScalingX",
  "lockScalingY",
  "lockSkewingX",
  "lockSkewingY",
] as const;

export type LockKey = (typeof lockValuesToRestore)[number];

const setLockValues = (value: boolean) => {
  return lockValuesToRestore.reduce((result, key) => {
    result[key] = value;
    return result;
  }, {} as Record<LockKey, boolean>);
};

export const lockObject = (obj: fabric.Object, selectable: boolean = true) => {
  obj.set({
    ...setLockValues(true),
    selectable,
    hasControls: false,
    borderColor: "red",
  });
};
