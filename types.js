/* @flow */
import { Map, List } from "immutable";

type Cell = Map<string, any>;
type Grid = List<List<Cell>>;
type FlowField = {
  getGrid: Function,
  getCell: Function,
  setTarget: Function,
  getTarget: Function,
  updateDistance: Function,
  updateVectorField: Function
};
type Position = Array<number>;
type UpdateFunction = (Grid, ?Position, ?number, ?number) => Grid;

export type { Cell, Grid, FlowField, Position, UpdateFunction };
