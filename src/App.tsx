import { CRS } from "leaflet";
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
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
        crs={CRS.Simple}
        maxBounds={[
          [-10, -10],
          [10, 10],
        ]}
      >
        <TileLayer url="http://localhost:3001/{z}/{x}/{y}.png" tileSize={64} />
      </MapContainer>
    </div>
  );
}

export default App;
