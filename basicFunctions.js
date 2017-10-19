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
  position: position,
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
/* this.grids[idGrid][targetTileX][targetTileZ].updated = true;
  let tilesTarget = [[targetTileX, targetTileZ]];
  let tilesToGoThrough = [];
  let distance = 1;
  //loop to go through
  //while not all elements in
  //this.grid are updated
  //with distance value from new target
  do {
    //loop through all current tiles selected
    //start with target tile clicked
    tilesTarget.forEach(tile => {
      _([this.grids[idGrid][tile[0]][tile[1]]])
        .filter(cell => cell.distance !== 9999)
        .forEach(currentTile => {
          //only update neighbours' cell
          //for cell without buildings on it
          let tilesToUpdate = getNeighbours(
            tile[0],
            tile[1],
            this.xMax,
            this.zMax,
            this.step
          );
          updateDistance(this.grids[idGrid], tilesToUpdate, distance);
          tilesToGoThrough.push(tilesToUpdate);
        });
    });
    //Get all neightbours from current tile that needs
    //to get distance value updated
    tilesTarget = _(tilesToGoThrough)
      //tilesToGoThrough array of array
      //=> needs to be flattened
      .flatten()
      //join tuple in string
      .map(tile => tile.join(","))
      //remove duplicates
      .uniq()
      //get tuple of int back
      .map(tile => tile.split(",").map(e => parseInt(e, 10)));

    tilesToGoThrough = [];
    distance = distance + 1;
    //console.timeEnd('2')
  } /* Still going while not everything updated  while (_.chain(
    this.grids[idGrid]
  )
    .flatten()
    .filter(cell => !cell.updated)
    .value().length !== 0); */
//}
export default {
  addBuilding,
  getNeighbours,
  getCorrectedTileIndices,
  updateDistance
};
