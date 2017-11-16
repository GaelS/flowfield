//@flow
import { Map, List } from 'immutable';
import reduce from 'lodash.reduce';
import compact from 'lodash.compact';
import type { Cell, Grid, FlowField, Position, UpdateFunction } from './types';

function getNeighbours(
  position: Position,
  outOfBounds: Function,
  grid: Grid
): Array<Position> {
  if (outOfBounds(position)) {
    return [];
  }
  const [x, y]: Position = position;
  // neighbours order
  // 1 8 7
  // 2   6
  // 3 4 5
  const allNeighbours = reduce(
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
    (acc: Object, position: Position, key: string): Object => {
      if (!outOfBounds(position)) {
        acc[key] = position;
      }
      return acc;
    },
    {}
  );
  let neighboursToConsider = compact([
    allNeighbours.L,
    allNeighbours.R,
    allNeighbours.B,
    allNeighbours.T
  ]);

  const isLeftGood =
    allNeighbours.L && !grid.getIn(allNeighbours.L).get('obstacle');
  const isRightGood =
    allNeighbours.R && !grid.getIn(allNeighbours.R).get('obstacle');
  const areSidesGood = isLeftGood || isRightGood;

  if (
    areSidesGood &&
    allNeighbours.T &&
    !grid.getIn(allNeighbours.T).get('obstacle')
  ) {
    isLeftGood && neighboursToConsider.push(allNeighbours.TL);
    isRightGood && neighboursToConsider.push(allNeighbours.TR);
  }
  if (
    areSidesGood &&
    allNeighbours.B &&
    !grid.getIn(allNeighbours.B).get('obstacle')
  ) {
    isLeftGood && neighboursToConsider.push(allNeighbours.BL);
    isRightGood && neighboursToConsider.push(allNeighbours.BR);
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
  */

function generateOutOfBoundsFunction(xRange: number, yRange: number): Function {
  if (!xRange || xRange < 1 || !yRange || yRange < 1) {
    throw 'Wrong inputs';
  }
  return function(position: Position): boolean {
    if (!Array.isArray(position) || position.length !== 2) {
      return true;
    }
    const [x, y] = position;
    return x < 0 || y < 0 || x > xRange - 1 || y > yRange - 1;
  };
}
export default {
  getNeighbours,
  getCorrectedTileIndices,
  generateOutOfBoundsFunction
};
