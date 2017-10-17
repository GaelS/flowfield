//@flow
import { Map, List } from "immutable";
import _ from "lodash";
import type { Cell, Grid, FlowField, Position } from "./types";

function addBuilding(position: Array<number>): Function {
  return (grid: Grid): Grid | Error => {
    const cellToModify: ?Cell = grid.getIn(position);
    if (!cellToModify) {
      throw "Error";
    }
    const newCell: Cell = cellToModify
      .set("distance", 9999)
      .set("updated", true);
    return grid.setIn(position, newCell);
  };
}

function getNeighbours(position: Position, size: number): Array<Position> {
  const [x, y]: Position = position;
  if (x < 0 && y < 0) {
    return [];
  }
  // neighbours order
  // 1 8 7
  // 2   6
  // 3 4 5
  return _.filter(
    [
      [x - 1, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1]
    ],
    ([x,y]: Position): boolean => x >= 0 && y >= 0
  );
}

//function to get tile indices
//based on a floating number
function getCorrectedTileIndices(target: Position, step: number): Position {
  const [x, y]: Position = target;
  if (step < 0 || x < 0 || y < 0) {
    throw "Error, one of the arguments is not positive";
  }
  return [Math.floor(target[0] / step), Math.floor(target[1] / step)];
}
export default {
  addBuilding,
  getNeighbours,
  getCorrectedTileIndices
};
