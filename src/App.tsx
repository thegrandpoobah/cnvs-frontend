import { MapContainer } from "react-leaflet";
import CustomGridLayer from "./CustomGridLayer";
import { TileStore } from "./Stores/TileStore";
import UnitCRS from "./UnitCRS";
import "./App.css";

setInterval(() => {
  TileStore.update((s) => {
    s.coins = s.coins + 10;
  });
}, 1000);

function App() {
  const position: [number, number] = [0, 0];

  return (
    <div className="App">
      <MapContainer
        center={position}
        zoom={0}
        minZoom={0}
        maxZoom={0}
        zoomControl={false}
        crs={UnitCRS}
        maxBounds={[
          [-10, -10],
          [10, 10],
        ]}
      >
        <CustomGridLayer tileSize={64} />
      </MapContainer>
    </div>
  );
}

export default App;
