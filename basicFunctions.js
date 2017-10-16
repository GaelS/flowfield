//@flow
import type { Cell, Grid, FlowField } from "./types";
import { Map, List } from "immutable";

function addBuilding(position: Array<number>): Function {
  return (grid: Grid): Grid | Error => {
      const cellToModify: ?Cell = grid.getIn(position);
      if(!cellToModify){
        throw 'Error';
      }
      const newCell: Cell = cellToModify
        .set("distance", 9999)
        .set("updated", true);
      return grid.setIn(position, newCell);
  };
}
export default {
  addBuilding
};
