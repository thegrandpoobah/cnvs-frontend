import { Coords } from "leaflet";

export interface TileData {
  coins?: number;
  hovered?: boolean;
  coords: Coords;
}
