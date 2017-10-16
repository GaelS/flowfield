/* @flow */
import { Map, List } from "immutable";

type Cell = Map<string, any>;
type Grid = List<List<Cell>>;
type FlowField = {
  getGrid: Function,
  getCell: Function,
  updateGrid: Function
};

export type { Cell, Grid, FlowField };
