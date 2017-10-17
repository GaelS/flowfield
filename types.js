/* @flow */
import { Map, List } from "immutable";

type Cell = Map<string, any>;
type Grid = List<List<Cell>>;
type FlowField = {
  getGrid: Function,
  getCell: Function,
  updateGrid: Function
};
type Position = Array<number>;
export type { Cell, Grid, FlowField, Position };
