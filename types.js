/* @flow */
import { Map, List } from 'immutable';

type Cell = Map<string, any>;
type Grid = List<List<Cell>>;
type FlowField = {
  getImmutableGrid: Function,
  getGrid: Function,
  getCell: Function,
  setTarget: Function,
  getTarget: Function,
  setObstacle: Function,
  removeObstacle: Function,
  getCellFromRealWorldCoordinates: Function,
  getPathFromCoordinates: Function
};
type Position = Array<number>;
type UpdateFunction = (Grid, ?Position, ?number, ?number) => Grid;

export type { Cell, Grid, FlowField, Position, UpdateFunction };
