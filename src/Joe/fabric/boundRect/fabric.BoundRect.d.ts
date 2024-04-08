declare namespace fabric {
  type BoundRectObjectConstructorConfig =
    ObjectConstructorConfig<fabric.BoundRect>;

  type BoundRectMixin = import("./BoundRect.init").BoundRectMixin;

  interface BoundRect extends BoundRectMixin {}

  class BoundRect extends fabric.Rect {
    canvas: fabric.Canvas;
    text: string;
    violationType: import("@/types/enum").ViolationType;
    boundColor: string;

    constructor(
      canvas: fabric.Canvas,
      text: string,
      violationType: import("@/types/enum").ViolationType,
      boundColor: string,
      options?: Partial<BoundRectObjectConstructorConfig>
    );
  }
}
