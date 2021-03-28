import { Store } from "pullstate";
import { TileData } from "../types/TileData";

export const TileStore = new Store<Map<string, TileData>>(
  new Map<string, TileData>()
);
