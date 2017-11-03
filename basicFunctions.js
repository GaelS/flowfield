//@flow
import { Map, List } from "immutable";
import _ from "lodash";
import type { Cell, Grid, FlowField, Position, UpdateFunction } from "./types";

function addBuilding(position: Array<number>): Function {
  return (grid: Grid): Grid | Error => {
    const cellToModify: ?Cell = grid.getIn(position);
    if (!cellToModify) {
      throw "Error";
    }
    const newCell: Cell = cellToModify
      .set("obstacle", true)
      .set("updated", true);
    return grid.setIn(position, newCell);
  };
}

function getNeighbours(position: Position): Array<Position> {
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
    ([x, y]: Position): boolean => x >= 0 && y >= 0
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

function updateDistance(
  target: Position,
  distance: number,
  step: number
): UpdateFunction {
  return function(grid, step, height, width, currentTarget) {
    //reset previous target
    //when a new target is added
    const g = distance === 0 ? setDistance(grid, [0, 0], -1, step) : grid;
    const updatedGrid = setDistance(g, target, distance, step);
    return updatedGrid;
  };
}
function setDistance(
  grid: Grid,
  position: Position,
  distance: number,
  step: number
): Grid {
  const [x, y]: Position = getCorrectedTileIndices(position, step);
  const targetCell: ?Cell = grid.getIn([x, y]);
  if (!targetCell) {
    throw "Error: target out of grid bounds";
  }
  const update = targetCell.merge(Map({ updated: distance !== -1, distance }));
  const updatedGrid = grid.setIn(position, update);
  return updatedGrid;
}

/* function updateVectorField(target) {
  let { targetTileX, targetTileZ } = getCorrectedTiles(
    target,
    this.xMax,
    this.zMax,
    this.step
  );
  const idGrid = `${targetTileX}${targetTileZ}`;
  //tmp
  a.forEach(id => this.scene.getMeshByID(id).dispose());
  a = [];
  let newGrid = this.grids[idGrid].map((row, i) => {
    return row.map((cell, j) => {
      let distance = cell.distance === 9999 ? -9999 : cell.distance;
      cell.direction = getDirection(
        i,
        j,
        distance,
        this.xMax,
        this.zMax,
        this.step,
        this.grids[idGrid]
      );
      return cell;
    });
  });
  this.grids[idGrid] = newGrid;
} */


export default {
  addBuilding,
  getNeighbours,
  getCorrectedTileIndices,
  updateDistance,
};
