import { Store } from "pullstate";
import ZoomlessCoord from "../utils/ZoomlessCoord";

interface Tile {
  coins: number;
  hovered: boolean;
  coords: ZoomlessCoord;
}

export const TileStore = new Store<Map<string, Tile>>(new Map<string, Tile>());
