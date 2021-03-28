import ReactDOM from "react-dom";
import {
  GridLayer,
  GridLayerOptions,
  Coords,
  LeafletMouseEvent,
  LeafletEvent,
  LatLngBounds,
} from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import CustomTile from "../CustomTile";
import ZoomlessCoord from "../../utils/ZoomlessCoord";
import { TileStore } from "../../stores/TileStore";
import { TileData } from "../../types/TileData";

interface CustomGridLayerOptions extends GridLayerOptions {}

class CustomGridLayerComponent extends GridLayer {
  createTile(coords: Coords): HTMLElement {
    const tileElement = document.createElement("div");
    const tileComponent = CustomTile({ coords: coords });
    ReactDOM.render(tileComponent, tileElement);

    return tileElement;
  }

  updateTile(props: TileData) {
    /* this depends on some implementation details in leaflet, but ce la vie */
    const key = this._tileCoordsToKey(props.coords);

    if (this._tiles[key]) {
      const tileElement = this._tiles[key].el;

      ReactDOM.render(CustomTile(props), tileElement);
    }
  }
}

function key(lat: number, lng: number) {
  return `0:${lat}:${lng}`;
}

function loadTileState(bounds: LatLngBounds) {
  TileStore.update((s) => {
    s.clear();

    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();

    for (let x = Math.floor(se.lat); x <= Math.ceil(nw.lat); x++) {
      for (let y = Math.floor(nw.lng); y <= Math.ceil(se.lng); y++) {
        s.set(key(x, y), {
          coins: Math.floor(Math.random() * 1000),
          hovered: false,
          coords: new ZoomlessCoord(y, x, 0),
        });
      }
    }
  });
}

function CustomGridLayer(props: CustomGridLayerOptions) {
  const context = useLeafletContext();
  const layerRef = useRef<CustomGridLayerComponent>();
  // const propsRef = useRef(props);

  useEffect(() => {
    layerRef.current = new CustomGridLayerComponent(props);
    const container = context.layerContainer || context.map;
    container.addLayer(layerRef.current);

    const unsubscribe = TileStore.subscribe(
      (s) => s,
      (newState) => {
        newState.forEach((v, k) => {
          layerRef.current?.updateTile(v);
        });
      }
    );

    loadTileState(context.map.getBounds());

    return () => {
      unsubscribe();
      container.removeLayer(layerRef.current as GridLayer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    mousemove: function (event: LeafletMouseEvent) {
      TileStore.update((s) => {
        s.forEach((v, k) => {
          v.hovered = false;
        });

        const lat = Math.floor(event.latlng.lat);
        const lng = Math.floor(event.latlng.lng);

        const k = key(lat, lng);
        if (s.has(k)) {
          const v = s.get(k) as TileData;
          v.hovered = true;
        }
      });
    },
    moveend: function (event: LeafletEvent) {
      loadTileState(context.map.getBounds());
    },
  });

  return null;
}

export default CustomGridLayer;
