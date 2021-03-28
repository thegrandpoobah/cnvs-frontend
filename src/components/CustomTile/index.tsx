import { Coords } from "leaflet";
import "./CustomTile.css";

interface CustomTileProps {
  coords: Coords;
  coins: number;
}

function CustomTile({ coins, coords }: CustomTileProps) {
  return (
    <div
      className="cnvs-tile"
      style={{
        backgroundImage: `url('http://localhost:3001/${coords.z}/${coords.x}/${coords.y}.png')`,
      }}
    >
      {coins} doge
    </div>
  );
}

export default CustomTile;
