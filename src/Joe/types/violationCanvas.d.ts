declare namespace fabric {
  type Position = {
    x: number;
    y: number;
  };

  interface Object {
    uuid: string;

    cacheTranslationX: number;
    cacheTranslationY: number;

    _cacheCanvas: HTMLCanvasElement | null;
    _cacheContext: CanvasRenderingContext2D | null;

    callSuper(fn: string, ...args: unknown[]): unknown;
  }
  type CanvasObjectsMap =
    import("@/fabric/violationCanvas/violationCanvasObjectsMap").CanvasObjectsMap;
  type CanvasHoveredObject =
    import("@/fabric/patches/extends-hovered-object/fabric.Canvas.patch").CanvasHoveredObject;

  interface Canvas extends CanvasHoveredObject, CanvasObjectsMap {
    callSuper(fn: string, ...args: unknown[]): unknown;
    _checkTarget(
      this: fabric.CollaboardCanvas,
      pointer: fabric.Position,
      object: fabric.Object,
      globalPointer: fabric.Position
    ): boolean;
    _normalizePointer(
      target: fabric.Object,
      position: fabric.Position
    ): fabric.Position;
  }
}
