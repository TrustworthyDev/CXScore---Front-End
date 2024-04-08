import { fabric } from "fabric";

const originalCheckTargetMethod = fabric.Canvas.prototype._checkTarget;

fabric.util.object.extend(fabric.Canvas.prototype, {
  _checkTarget(
    this: fabric.Canvas,
    pointer: fabric.Position,
    object: fabric.Object,
    globalPointer: fabric.Position
  ): boolean {
    const isTarget = originalCheckTargetMethod.call(
      this,
      pointer,
      object,
      globalPointer
    );
    if (
      isTarget &&
      this.isTargetTransparent(object, globalPointer.x, globalPointer.y)
    ) {
      return false;
    }
    return isTarget;
  },

  // isTargetTransparent(
  //   this: fabric.Canvas,
  //   target: fabric.Object,
  //   x: number,
  //   y: number
  // ): boolean {
  //   if (target.shouldCache() && target._cacheCanvas && target._cacheContext) {
  //     const normalizedPointer = this._normalizePointer(target, { x, y });
  //     const targetRelativeX = Math.max(
  //       target.cacheTranslationX + normalizedPointer.x,
  //       0
  //     );
  //     const targetRelativeY = Math.max(
  //       target.cacheTranslationY + normalizedPointer.y,
  //       0
  //     );

  //     return fabric.util.isTransparent(
  //       target._cacheContext,
  //       Math.round(targetRelativeX),
  //       Math.round(targetRelativeY),
  //       this.targetFindTolerance ?? 0
  //     );
  //   }
  //   return false;
  // },
});
