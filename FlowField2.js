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

  return {
    getGrid(): Grid {
      return grid;
    },
    getCell(x: number, y: number): Cell {
      return grid.get(x).get(y);
    },
    setTarget(newTarget: Position): Position {
      if (!newTarget || newTarget[0] < 0 || newTarget[1] < 0) {
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
          Map({ updated: true, distance: 0 })
        );
        grid = grid.setIn(newTarget, targetSet);
      }
      target = newTarget;
      return target;
    },
    getTarget(): ?Position {
      return target;
    },
    updateDistance(): Grid {
      grid = grid.map((row: List<Cell>): List<Cell> =>
        row.map((cell: Cell): Cell => {
          const currentDistance: number = cell.get("distance");
          return currentDistance > 0 ? cell : cell.set("updated", false);
        })
      );
      const numberOfObstacles: number = grid.map((row: List<Cell>): List<
        Cell
      > => row.filter((cell: Cell): boolean => cell.get("obstacle"))).size;
      let distance: number = 1;
      let updatedTiles: number = 1 + numberOfObstacles; // 1 because the target
      let tilesToUpdate: List<Position> = List();
      tilesToUpdate = tilesToUpdate.push(target);
      //loop to go through
      //while not all elements in
      //this.grid are updated
      //with distance  value from new target
      do {
        const neighbours: List<Position> = tilesToUpdate
          .map((position: Position): List<Position> => {
            return List(utils.getNeighbours(position));
          })
          .flatten()
          .filter(
            (position: Position) =>
              console.log(
                position,
                height,
                width,
                position[0] < height && position[1] < width
              ) ||
              (position[0] < height && position[1] < width)
          );

        tilesToUpdate.clear();
        console.log(neighbours.size);
        neighbours.forEach((position: Position): void => {
          if (grid.getIn(position).get("updated")) {
            return;
          }
          const cell = grid.getIn(position);
          if (cell) {
            grid = grid.setIn(
              position,
              cell.merge(Map({ distance, updated: true }))
            );
            updatedTiles = updatedTiles + 1;

            tilesToUpdate = tilesToUpdate.push(position);
          }
        });
        //console.log(tilesToUpdate);
        distance = distance + 1;
        //loop through all current tiles selected
        //start with target tile clicked
      } /* Still going while not everything updated */ while (updatedTiles ===
        width * height / step);
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
