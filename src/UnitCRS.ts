import { CRS, Util, Transformation } from "leaflet";

const UnitCRS = Util.extend({}, CRS.Simple, {
  transformation: new Transformation(64, 0, 64, 0),
});

export default UnitCRS;
