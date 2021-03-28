import { MapContainer } from "react-leaflet";
import CustomGridLayer from "./components/CustomGridLayer";
import UnitCRS from "./UnitCRS";
import "./App.css";

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
          [-100, -100],
          [100, 100],
        ]}
      >
        <CustomGridLayer tileSize={64} />
      </MapContainer>
    </div>
  );
}

export default App;
