import { Point } from "leaflet";

export default class ZoomlessCoord extends Point {
  z: number;

  constructor(x: number, y: number, z: number) {
    super(x, y);

    this.z = z;
  }
}
