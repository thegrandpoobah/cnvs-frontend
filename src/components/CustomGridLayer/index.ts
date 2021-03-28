import ReactDOM from "react-dom";
import {
  GridLayer,
  GridLayerOptions,
  Coords,
  LeafletMouseEvent,
  LeafletEvent,
} from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import CustomTile from "../CustomTile";
import ZoomlessCoord from "../../utils/ZoomlessCoord";

interface CustomGridLayerOptions extends GridLayerOptions {}

class CustomGridLayerComponent extends GridLayer {
  createTile(coords: Coords): HTMLElement {
    const tileElement = document.createElement("div");
    const tileComponent = CustomTile({ coins: 500, coords: coords });
    ReactDOM.render(tileComponent, tileElement);

    return tileElement;
  }

  updateTile(coords: Coords, coins: number) {
    /* this depends on some implementation details in leaflet, but ce la vie */
    const key = this._tileCoordsToKey(coords);

    const tileElement = this._tiles[key].el;

    ReactDOM.render(CustomTile({ coins: coins, coords: coords }), tileElement);
  }
}

function CustomGridLayer(props: CustomGridLayerOptions) {
  const context = useLeafletContext();
  const layerRef = useRef<CustomGridLayerComponent>();
  // const propsRef = useRef(props);

  useEffect(() => {
    layerRef.current = new CustomGridLayerComponent(props);
    const container = context.layerContainer || context.map;
    container.addLayer(layerRef.current);

    return () => {
      container.removeLayer(layerRef.current as GridLayer);
    };
  });

  useMapEvents({
    mousemove: function (event: LeafletMouseEvent) {
      if (!layerRef.current) {
        return;
      }

      (layerRef.current as CustomGridLayerComponent).updateTile(
        new ZoomlessCoord(
          Math.trunc(event.latlng.lng),
          Math.trunc(event.latlng.lat),
          0
        ),
        Math.floor(Math.random() * 100)
      );
    },
    moveend: function (event: LeafletEvent) {
      console.log(context.map.getBounds());
    },
  });

  return null;
}

export default CustomGridLayer;
