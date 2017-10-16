/* @flow */
import _ from "lodash";
import { Map, List } from "immutable";
import type { Cell, Grid, FlowField } from "./types";

export default function(
  step: number,
  height: number,
  width: number
): FlowField {
  const xRange: number = Math.ceil(width / step);
  const yRange: number = Math.ceil(height / step);

  let grid: Grid = List(_.range(0, xRange)).map((__: number): List<Cell> =>
    List(_.range(0, yRange)).map((__: number): Cell =>
      Map({
        distance: 0,
        updated: false,
        direction: [0, 0]
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
    updateGrid(fn: Function): Grid | Error {
      try {
        grid = fn(grid);
        return grid;
      } catch (e) {
        throw "Invalid Modification";
      }
    }
  };
}
