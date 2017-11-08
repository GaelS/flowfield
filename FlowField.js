/* @flow */
import _ from 'lodash';
import { Map, List } from 'immutable';

import type { Cell, Grid, FlowField, UpdateFunction, Position } from './types';

import utils from './basicFunctions';

export default function(
  step: number,
  height: number,
  width: number
): FlowField {
  const xRange: number = Math.ceil(width / step);
  const yRange: number = Math.ceil(height / step);
  let target: ?Position;
  //let cache: Map<Grid> = {};
  let grid: Grid = List(_.range(0, xRange)).map((): List<Cell> =>
    List(_.range(0, yRange)).map((): Cell =>
      Map({
        distance: -1,
        updated: false,
        direction: [0, 0],
        obstacle: false
      })
    )
  );
  function outOfBounds(position: Position): boolean {
    return (
      !position ||
      position.length < 2 ||
      position[0] < 0 ||
      position[1] < 0 ||
      position[0] > width / step ||
      position[1] > height / step
    );
  }
  return {
    getImmutableGrid(): Grid {
      return grid;
    },
    getGrid(): Array<Array<Object>> {
      return grid.map(row => row.map(cell => cell.toJS()).toArray()).toArray();
    },
    getCell(position: Position): Object {
      if (outOfBounds(position)) {
        throw 'Out of bounds coordinated provided';
      }
      return grid.getIn(position).toJS();
    },
    setObstacle(obstacle: Position): Grid {
      if (outOfBounds(obstacle)) {
        throw 'Invalid position';
      }
      const cell: ?Cell = grid.getIn(obstacle);
      if (cell) {
        const updatedCell: Cell = cell
          .set('obstacle', true)
          .set('distance', -1)
          .set('updated', true)
          .set('direction', [0, 0]);
        grid = grid.setIn(obstacle, updatedCell);
      }
      return grid;
    },
    removeObstacle(obstacle: Position): Grid {
      if (outOfBounds(obstacle)) {
        throw 'Invalid position';
      }
      const cell: ?Cell = grid.getIn(obstacle);
      if (cell) {
        const updatedCell: Cell = cell
          .set('obstacle', false)
          .set('distance', 0)
          .set('updated', false)
          .set('direction', [0, 0]);
        grid = grid.setIn(obstacle, updatedCell);
      }
      return grid;
    },
    setTarget(newTarget: Position): Grid {
      if (outOfBounds(newTarget)) {
        throw 'Invalid target';
      }
      if (target) {
        const targetCell: ?Cell = grid.getIn(target);
        if (targetCell) {
          const cellReset: Cell = targetCell.merge(
            Map({ updated: false, distance: -1, obstacle: false })
          );
          grid = grid.setIn(target, cellReset);
        }
      }
      const newTargetCell: ?Cell = grid.getIn(newTarget);
      if (newTargetCell) {
        const targetSet: Cell = newTargetCell.merge(
          Map({ distance: 0, updated: true, obstacle: false })
        );
        grid = grid.setIn(newTarget, targetSet);
      }
      target = newTarget;
      return grid;
    },
    getTarget(): ?Position {
      return target;
    },
    updateDistance(): Grid {
      if (!target) {
        return grid;
      }
      grid = grid.map((row: List<Cell>): List<Cell> =>
        row.map((cell: Cell): Cell => {
          const isItTheTarget: boolean = cell.get('distance') === 0;
          const isItAnObstacle: boolean = cell.get('obstacle');
          return isItAnObstacle || isItTheTarget
            ? cell
            : cell.set('updated', false);
        })
      );
      let distance: number = 1;
      let tilesToUpdate: List<Position> = List();
      tilesToUpdate = tilesToUpdate.push(target);
      console.time('1');
      do {
        const neighbours: List<Position> = tilesToUpdate
          .map((position: Position): List<Position> => {
            return List(
              utils.getNeighbours(position, width, height, step, grid)
            );
          })
          .flatten();

        tilesToUpdate = tilesToUpdate.clear();
        neighbours.forEach((position: Position): void => {
          const cell = grid.getIn(position);
          if (cell && !cell.get('updated')) {
            grid = grid.setIn(
              position,
              cell.merge(Map({ distance, updated: true }))
            );
            tilesToUpdate = tilesToUpdate.push(position);
          }
        });
        grid.map(e => f => f.map(console.log(f.get('distance'))));
        distance = distance + 1;
      } while (tilesToUpdate.size > 0);
      console.timeEnd('1');
      return grid;
    },
    updateVectorField(): Grid {
      if (!target) {
        return grid;
      }
      let newGrid: Grid = grid.map((row, i) => {
        return row.map((cell, j) => {
          if (cell.get('distance') === 0 || cell.get('obstacle')) {
            return cell;
          }
          //Get All neightbours for current cell
          let neighbours: Array<Cell> = utils
            .getNeighbours([i, j], width, height, step, grid)
            .map((position: Position): Array => [
              grid.getIn(position),
              position
            ])
            .filter((cell: Cell): boolean => !cell[0].get('obstacle'));
          //Get minimum distance
          let minimumDistance: number = _(
            neighbours
          ).minBy((cell: Cell): number => cell[0].get('distance'))[0];
          //Get only cell with their distance equals to minimum
          const validNeighbours = _(neighbours)
            .filter(
              cell =>
                cell[0].get('distance') === minimumDistance.get('distance')
            )
            //Calculate heading to target from each possible cell
            .map(([cell, position]) => {
              const toTarget: Array<number> = [target[0] - i, target[1] - j];
              const toLocalTarget: Array<number> = [
                position[0] - i,
                position[1] - j
              ];
              const dot: number =
                toTarget[0] * toLocalTarget[0] + toTarget[1] * toLocalTarget[1];
              const cross: number =
                toTarget[0] * toLocalTarget[1] - toTarget[1] * toLocalTarget[0];

              return [Math.abs(Math.atan(cross / dot)), position];
            })
            .value();

          const cellWithBestHeadingToTarget: Position = _.minBy(
            validNeighbours,
            ([angle, position]) => angle
          )[1];
          return cell.set('direction', [
            cellWithBestHeadingToTarget[0] - i,
            cellWithBestHeadingToTarget[1] - j
          ]);
        });
      });
      grid = newGrid;
      return grid;
    }
  };
}
