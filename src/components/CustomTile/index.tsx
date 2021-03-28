import "./CustomTile.css";
import { TileData } from "../../types/TileData";

function CustomTile({ coins, hovered, coords }: TileData) {
  return (
    <div
      className="cnvs-tile"
      style={{
        backgroundImage: `url('http://localhost:3001/${coords.z}/${coords.x}/${coords.y}.png')`,
        border: hovered ? "1px solid red" : "inherit",
      }}
    >
      <div>{coins} doge</div>
      <div>
        {coords.x} : {coords.y}
      </div>
    </div>
  );
}

export default CustomTile;
