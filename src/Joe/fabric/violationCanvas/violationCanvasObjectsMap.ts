import { flattenObjectTree, isDefined } from "@/utils/fabricUtils";
import { fabric } from "fabric";

export interface CanvasObjectsMap {
  _objectsByUUID: Map<string, fabric.Object>;

  _addObjectToMap(object: fabric.Object): void;
  _addObjectsToMap(objects: fabric.Object[]): void;
  _removeObjectFromMap(object: fabric.Object): void;

  initializeObjectsMap(): void;
  hasObjectWithUUID(uuid: string): boolean;
  getObjectByUUID<T extends fabric.Object>(uuid: string): T | undefined;
  getObjectsByUUIDs(uuids: string[]): fabric.Object[];
  getAllObjectUUIDs(): string[];
}

const originalOnObjectAdded = fabric.Canvas.prototype._onObjectAdded;
const originalOnObjectRemoved = fabric.Canvas.prototype._onObjectRemoved;

const mixin: MethodsOfMixin<CanvasObjectsMap> & Partial<fabric.Canvas> = {
  initializeObjectsMap() {
    this._objectsByUUID = new Map();
  },

  /**
   * Find an object by the given UUID.
   */
  getObjectByUUID<T>(this: fabric.Canvas, uuid: string): T | undefined {
    return this._objectsByUUID.get(uuid) as T | undefined;
  },

  /**
   * Check if an object with the given UUID is available in the map.
   */
  hasObjectWithUUID(this: fabric.Canvas, uuid: string): boolean {
    return this._objectsByUUID.has(uuid);
  },

  /**
   * Find objects by the given UUIDs.
   */
  getObjectsByUUIDs(this: fabric.Canvas, uuids: string[]): fabric.Object[] {
    return uuids.map((uuid) => this.getObjectByUUID(uuid)).filter(isDefined);
  },

  getAllObjectUUIDs(this: fabric.Canvas): string[] {
    return Array.from(this._objectsByUUID.keys());
  },

  _onObjectAdded(this: fabric.Canvas, object: fabric.Object) {
    originalOnObjectAdded && originalOnObjectAdded.call(this, object);
    this._addObjectToMap(object);
  },

  _onObjectRemoved(this: fabric.Canvas, object: fabric.Object) {
    originalOnObjectRemoved.call(this, object);
    this._removeObjectFromMap(object);
  },

  _addObjectToMap(this: fabric.Canvas, object: fabric.Object) {
    flattenObjectTree([object]).forEach((o) =>
      this._objectsByUUID.set(o.uuid, o)
    );
  },

  _addObjectsToMap(this: fabric.Canvas, objects: fabric.Object[]) {
    objects.forEach(this._addObjectToMap, this);
  },

  _removeObjectFromMap(this: fabric.Canvas, object: fabric.Object) {
    flattenObjectTree([object]).forEach((o) =>
      this._objectsByUUID.delete(o.uuid)
    );
  },
};

fabric.util.object.extend(fabric.Canvas.prototype, mixin);
