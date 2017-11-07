//@flow
import { Map, List } from 'immutable';
import _ from 'lodash';
import type { Cell, Grid, FlowField, Position, UpdateFunction } from './types';

function getNeighbours(
  position: Position,
  width: number,
  height: number,
  step: number,
  grid: Grid
): Array<Position> {
  const [x, y]: Position = position;
  if (x < 0 || y < 0 || x > width / step || y > height / step) {
    return [];
  }
  // neighbours order
  // 1 8 7
  // 2   6
  // 3 4 5
  const allNeighbours = _.reduce(
    {
      TL: [x - 1, y + 1],
      L: [x - 1, y],
      BL: [x - 1, y - 1],
      B: [x, y - 1],
      BR: [x + 1, y - 1],
      R: [x + 1, y],
      TR: [x + 1, y + 1],
      T: [x, y + 1]
    },
    (acc: object, [x, y]: Position, key: string): object => {
      if (x >= 0 && y >= 0 && x < width / step && y < height / step) {
        acc[key] = [x, y];
      }
      return acc;
    },
    {}
  );

  let neighboursToConsider = _.compact([
    allNeighbours.L,
    allNeighbours.R,
    allNeighbours.B,
    allNeighbours.T
  ]);
  if (
    allNeighbours.L &&
    !grid.getIn(allNeighbours.L).get('obstacle') &&
    allNeighbours.T &&
    !grid.getIn(allNeighbours.T).get('obstacle')
  ) {
    neighboursToConsider.push(allNeighbours.TL);
  }
  if (
    allNeighbours.L &&
    !grid.getIn(allNeighbours.L).get('obstacle') &&
    allNeighbours.B &&
    !grid.getIn(allNeighbours.B).get('obstacle')
  ) {
    neighboursToConsider.push(allNeighbours.BL);
  }
  if (
    allNeighbours.R &&
    !grid.getIn(allNeighbours.R).get('obstacle') &&
    allNeighbours.T &&
    !grid.getIn(allNeighbours.T).get('obstacle')
  ) {
    neighboursToConsider.push(allNeighbours.TR);
  }

  if (
    allNeighbours.R &&
    !grid.getIn(allNeighbours.R).get('obstacle') &&
    allNeighbours.B &&
    !grid.getIn(allNeighbours.B).get('obstacle')
  ) {
    neighboursToConsider.push(allNeighbours.BR);
  }
  return neighboursToConsider;
}

//function to get tile indices
//based on a floating number
function getCorrectedTileIndices(target: Position, step: number): Position {
  const [x, y]: Position = target;
  if (step < 0 || x < 0 || y < 0) {
    throw 'Error, one of the arguments is not positive';
  }
  return [Math.floor(target[0] / step), Math.floor(target[1] / step)];
}

/*
  ** (o) | x | (o)
  **  x  | o |  x
  ** (o) | x | (o)
  ** Cell with (o)
  */

/* function isItACornerCell(currentCell: Position, position: Position): Object {
  const [x, y] = position;
  const topOrBottom = currentCell[1] === y - 1 || currentCell[1] === y + 1;
  return {
    TL: currentCell[1] === y - 1 && currentCell[0] === x + 1,
    DL: currentCell[1] === y - 1 && currentCell[0] === x - 1,
    TR: currentCell[1] === y + 1 && currentCell[0] === x + 1,
    DR: currentCell[1] === y + 1 && currentCell[0] === x - 1
  };
} */

function isCellSurroundedByObstacles(
  currentCell: Position,
  grid: Grid
): Function {
  return function(position: Position): boolean {};
}
/*
  ** (o) | x | (o)
  **  x  | o |  x
  ** (o) | x | (o)
  */
export default {
  getNeighbours,
  getCorrectedTileIndices,
  isCellSurroundedByObstacles
};
