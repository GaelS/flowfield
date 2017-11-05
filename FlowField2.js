/* @flow */
import _ from "lodash";
import { Map, List } from "immutable";

import type { Cell, Grid, FlowField, UpdateFunction, Position } from "./types";

import utils from "./basicFunctions";

export default function(
  step: number,
  height: number,
  width: number
): FlowField {
  const xRange: number = Math.ceil(width / step);
  const yRange: number = Math.ceil(height / step);
  let target: ?Position;
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
    getGrid(): Grid {
      return grid;
    },
    getCell(position: Position): ?Cell {
      if(outOfBounds(position)){
        throw 'Out of bounds coordinated provided';
      }
      return grid.getIn(position);
    },
    setObstacle(obstacle: Position): Grid {
      if (outOfBounds(obstacle)) {
        throw "Invalid position";
      }
      const cell: ?Cell = grid.getIn(obstacle);
      if (cell) {
        const updatedCell: Cell = cell
          .set("obstacle", true)
          .set("updated", true);
        grid = grid.setIn(obstacle, updatedCell);
      }
      return grid;
    },
    setTarget(newTarget: Position): Grid {
      if (outOfBounds(newTarget)) {
        throw "Invalid target";
      }
      if (target) {
        const targetCell: ?Cell = grid.getIn(target);
        if (targetCell) {
          const cellReset: Cell = targetCell.merge(
            Map({ updated: false, distance: -1 })
          );
          grid = grid.setIn(target, cellReset);
        }
      }
      const newTargetCell: ?Cell = grid.getIn(newTarget);
      if (newTargetCell) {
        const targetSet: Cell = newTargetCell.merge(
          Map({ distance: 0, updated: true })
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
          const currentDistance: number = cell.get("distance");
          return currentDistance === 0 ? cell : cell.set("updated", false);
        })
      );
      let distance: number = 1;
      let tilesToUpdate: List<Position> = List();
      tilesToUpdate = tilesToUpdate.push(target);
      console.time("1");
      do {
        const neighbours: List<Position> = tilesToUpdate
          .map((position: Position): List<Position> => {
            return List(utils.getNeighbours(position));
          })
          .flatten()
          .filter(
            (position: Position) =>
              position[0] < width / step && position[1] < height / step
          );

        tilesToUpdate = tilesToUpdate.clear();
        neighbours.forEach((position: Position): void => {
          const cell = grid.getIn(position);
          if (cell && !cell.get("updated")) {
            //console.log(cell, !cell.get("updated"), cell.get("updated"));
            grid = grid.setIn(
              position,
              cell.merge(Map({ distance, updated: true }))
            );
            tilesToUpdate = tilesToUpdate.push(position);
          }
        });
        distance = distance + 1;
      } while (tilesToUpdate.size > 0);
      console.timeEnd("1");
      return grid;
    },
    updateVector(): void {
      return;
    }
  };
}
/*  
updateGrid(fn: UpdateFunction): Grid | Error {
  try {
    grid = fn(grid, step, height, width, target);
    return grid;
  } catch (e) {
    throw  e;
  } */
