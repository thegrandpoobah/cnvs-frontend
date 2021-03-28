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
import { useEffect, useRef, useState } from "react";
import { useMapEvents } from "react-leaflet";
import CustomTile from "../CustomTile";
import ZoomlessCoord from "../../utils/ZoomlessCoord";
import { TileStore } from "../../Stores/TileStore";

interface CustomGridLayerOptions extends GridLayerOptions {}

class CustomGridLayerComponent extends GridLayer {
  createTile(coords: Coords): HTMLElement {
    const tileElement = document.createElement("div");
    const tileComponent = CustomTile({ coords: coords });
    ReactDOM.render(tileComponent, tileElement);

    return tileElement;
  }

  updateTile(coords: Coords, coins: number | undefined) {
    /* this depends on some implementation details in leaflet, but ce la vie */
    const key = this._tileCoordsToKey(coords);

    const tileElement = this._tiles[key].el;

    ReactDOM.render(CustomTile({ coins: coins, coords: coords }), tileElement);
  }
}

function loadTileState(bounds: LatLngBounds) {
  TileStore.update((s) => {
    s.clear();

    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();

    for (let x = Math.floor(se.lat); x <= Math.ceil(nw.lat); x++) {
      for (let y = Math.floor(nw.lng); y <= Math.ceil(se.lng); y++) {
        s.set(`0:${x}:${y}`, {
          coins: Math.floor(Math.random() * 100),
          hovered: false,
          coords: new ZoomlessCoord(x, y, 0),
        });
      }
    }
  });
}

function CustomGridLayer(props: CustomGridLayerOptions) {
  const context = useLeafletContext();
  const layerRef = useRef<CustomGridLayerComponent>();
  // const propsRef = useRef(props);

  const [lastHover, setLastHover] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>({
    lat: undefined,
    lng: undefined,
  });

  const tileStore = TileStore.useState();

  useEffect(() => {
    loadTileState(context.map.getBounds());

    layerRef.current = new CustomGridLayerComponent(props);
    const container = context.layerContainer || context.map;
    container.addLayer(layerRef.current);

    return () => {
      container.removeLayer(layerRef.current as GridLayer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    mousemove: function (event: LeafletMouseEvent) {
      if (!layerRef.current) {
        return;
      }

      const component = layerRef.current as CustomGridLayerComponent;

      const lat = Math.trunc(event.latlng.lat);
      const lng = Math.trunc(event.latlng.lng);

      if (lastHover.lat !== lat || lastHover.lng !== lng) {
        // we moved to a different tile, turn off the hover state
        // component.updateTile(new ZoomlessCoord(lng, lat, 0), coins);
        console.log("we went to a different tile");
      }

      setLastHover({
        lat: lat,
        lng: lng,
      });

      const coinCount = tileStore.get(`0:${lat}:${lng}`)?.coins;

      component.updateTile(new ZoomlessCoord(lng, lat, 0), coinCount);
    },
    moveend: function (event: LeafletEvent) {
      console.log(context.map.getBounds());
    },
  });

  return null;
}

export default CustomGridLayer;
