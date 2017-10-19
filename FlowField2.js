/* @flow */
import _ from "lodash";
import { Map, List } from "immutable";
import type { Cell, Grid, FlowField, UpdateFunction, position } from "./types";

export default function(
  step: number,
  height: number,
  width: number
): FlowField {
  const xRange: number = Math.ceil(width / step);
  const yRange: number = Math.ceil(height / step);
  let target: ?position;
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
    updateGrid(fn: UpdateFunction): Grid | Error {
      try {
        grid = fn(grid, step, height, width, target);
        return grid;
      } catch (e) {
        throw e;
      }
    }
  };
}
