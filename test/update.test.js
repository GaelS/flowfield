const expect = require('expect');
const createFlowField = require('../FlowField').default;
const { List } = require('immutable');

describe('FlowField', function() {
  const flowfield = createFlowField(1, 2, 2);
  describe('target', function() {
    const FF = createFlowField(1, 4, 4);
    const grid = FF.getGrid();
    FF.setTarget([0, 0]);
    expect(FF.getTarget()).toEqual([0, 0]);
  });
  describe('update', function() {
    it('should return current grid if no target are defined', function() {
      const FF = createFlowField(1, 4, 4);
      const grid = FF.getGrid();
      FF.updateDistance();
      expect(FF.getGrid()).toEqual(grid);
    });
    it('should calculate distances from target correctly', function() {
      const FF = createFlowField(1, 4, 4);
      const grid = FF.getGrid();
      FF.setTarget([0, 0]);
      FF.updateDistance();

      const newGrid = FF.getImmutableGrid()
        .map(e => e.map(r => r.get('distance')))
        .toArray();

      expect(newGrid[0]).toEqual(List.of(0, 1, 2, 3));
      expect(newGrid[1]).toEqual(List.of(1, 1, 2, 3));
      expect(newGrid[2]).toEqual(List.of(2, 2, 2, 3));
      expect(newGrid[3]).toEqual(List.of(3, 3, 3, 3));
    });
    it('should not update distance of cell located between two obstacles', function() {
      /*
    ** (o) | x | (o)
    **  x  | o |  x
    ** (o) | x | (o)
    ** 
    ** In that configuration cells with (o) should not be updated
    ** when working with centered cell in update distance 
    */
      const FF = createFlowField(1, 4, 4);
      FF.setTarget([0, 0]);
      FF.setObstacle([1, 2]);
      FF.setObstacle([2, 1]);
      FF.updateDistance();
      const grid = FF.getImmutableGrid()
        .map(e => e.map(r => r.get('distance')))
        .toArray();
      expect(grid[0]).toEqual(List.of(0, 1, 2, 3));
      expect(grid[1]).toEqual(List.of(1, 1, -1, 4));
      expect(grid[2]).toEqual(List.of(2, -1, 6, 5));
      expect(grid[3]).toEqual(List.of(3, 4, 5, 6));
    });
  });
  it('should return the grid unmodified if trying to delete obstacle that does not exist', function() {
    const FF = createFlowField(1, 4, 4);
    const grid = FF.getImmutableGrid();
    FF.setObstacle([-1, 2]);
    const newGrid = FF.getImmutableGrid();
    expect(grid).toEqual(newGrid);
  });
  it('should return unmodified grid when uncorrect coordinated are given to remove obstacle', function() {
    const FF = createFlowField(1, 2, 2);
    const grid = FF.getImmutableGrid();
    FF.setObstacle([1, 2]);
    FF.removeObstacle([-1, -2]);
    expect(grid).toEqual(FF.getImmutableGrid());
  });
  it('should return a grid with no obstacle if one adds two and delete both of them', function() {
    const FF = createFlowField(1, 4, 4);
    FF.setTarget([0, 0]);
    FF.setObstacle([1, 2]);
    FF.setObstacle([2, 1]);
    FF.removeObstacle([2, 1]);
    FF.removeObstacle([1, 2]);

    FF.updateDistance();
    const grid = FF.getImmutableGrid()
      .map(e => e.map(r => r.get('distance')))
      .toArray();
    expect(grid[0]).toEqual(List.of(0, 1, 2, 3));
    expect(grid[1]).toEqual(List.of(1, 1, 2, 3));
    expect(grid[2]).toEqual(List.of(2, 2, 2, 3));
    expect(grid[3]).toEqual(List.of(3, 3, 3, 3));
  });
  it('should update distances correctly when one adds obstacle 1', function() {
    const FF = createFlowField(1, 4, 4);
    const grid = FF.getGrid();
    FF.setTarget([1, 1]);
    FF.setObstacle([0, 0]);
    FF.setObstacle([2, 2]);
    FF.updateDistance();

    const newGrid = FF.getImmutableGrid()
      .map(e => e.map(r => r.get('distance')))
      .toArray();

    expect(newGrid[0]).toEqual(List.of(-1, 1, 1, 2));
    expect(newGrid[1]).toEqual(List.of(1, 0, 1, 2));
    expect(newGrid[2]).toEqual(List.of(1, 1, -1, 3));
    expect(newGrid[3]).toEqual(List.of(2, 2, 3, 4));
  });
});
it('should update distances correctly when one adds obstacle 2', function() {
  const FF = createFlowField(1, 10, 10);
  const grid = FF.getGrid();
  FF.setTarget([5, 5]);
  FF.setObstacle([2, 2]);
  FF.setObstacle([2, 3]);
  FF.setObstacle([2, 4]);

  FF.updateDistance();

  const newGrid = FF.getImmutableGrid()
    .map(e => e.map(r => r.get('distance')))
    .toArray();

  expect(newGrid[0]).toEqual(List.of(7, 7, 7, 6, 5, 5, 5, 5, 5, 5));
  expect(newGrid[1]).toEqual(List.of(6, 6, 7, 6, 5, 4, 4, 4, 4, 4));
  expect(newGrid[2]).toEqual(List.of(5, 5, -1, -1, -1, 3, 3, 3, 3, 4));
  expect(newGrid[3]).toEqual(List.of(5, 4, 3, 2, 2, 2, 2, 2, 3, 4));
  expect(newGrid[4]).toEqual(List.of(5, 4, 3, 2, 1, 1, 1, 2, 3, 4));
  expect(newGrid[5]).toEqual(List.of(5, 4, 3, 2, 1, 0, 1, 2, 3, 4));
  expect(newGrid[6]).toEqual(List.of(5, 4, 3, 2, 1, 1, 1, 2, 3, 4));
  expect(newGrid[7]).toEqual(List.of(5, 4, 3, 2, 2, 2, 2, 2, 3, 4));
  expect(newGrid[8]).toEqual(List.of(5, 4, 3, 3, 3, 3, 3, 3, 3, 4));
  expect(newGrid[9]).toEqual(List.of(5, 4, 4, 4, 4, 4, 4, 4, 4, 4));
});
it('should update distances correctly when one adds obstacle 3', function() {
  const FF = createFlowField(1, 10, 10);
  const grid = FF.getGrid();
  FF.setTarget([5, 5]);
  FF.setObstacle([2, 2]);
  FF.setObstacle([2, 3]);
  FF.setObstacle([2, 4]);
  FF.setObstacle([5, 7]);
  FF.setObstacle([6, 7]);
  FF.setObstacle([7, 7]);
  FF.setObstacle([8, 7]);

  FF.updateDistance();

  const updatedGrid = FF.getImmutableGrid()
    .map(e => e.map(r => r.get('distance')))
    .toArray();

  expect(updatedGrid[0]).toEqual(List.of(7, 7, 7, 6, 5, 5, 5, 5, 5, 5));
  expect(updatedGrid[1]).toEqual(List.of(6, 6, 7, 6, 5, 4, 4, 4, 4, 4));
  expect(updatedGrid[2]).toEqual(List.of(5, 5, -1, -1, -1, 3, 3, 3, 3, 4));
  expect(updatedGrid[3]).toEqual(List.of(5, 4, 3, 2, 2, 2, 2, 2, 3, 4));
  expect(updatedGrid[4]).toEqual(List.of(5, 4, 3, 2, 1, 1, 1, 2, 3, 4));
  expect(updatedGrid[5]).toEqual(List.of(5, 4, 3, 2, 1, 0, 1, -1, 4, 4));
  expect(updatedGrid[6]).toEqual(List.of(5, 4, 3, 2, 1, 1, 1, -1, 5, 5));
  expect(updatedGrid[7]).toEqual(List.of(5, 4, 3, 2, 2, 2, 2, -1, 6, 6));
  expect(updatedGrid[8]).toEqual(List.of(5, 4, 3, 3, 3, 3, 3, -1, 7, 7));
  expect(updatedGrid[9]).toEqual(List.of(5, 4, 4, 4, 4, 4, 4, 5, 6, 7));
});
it('return the grid unmodified after an updateVector if no target is set', function() {
  const FF = createFlowField(1, 4, 4);
  const grid = FF.getImmutableGrid();
  FF.updateVectorField();
  expect(grid).toEqual(FF.getImmutableGrid());
});
it('should calculate direction to target correctly', function() {
  const FF = createFlowField(1, 4, 4);
  const grid = FF.getGrid();
  FF.setTarget([0, 0]);
  FF.updateDistance();
  FF.updateVectorField();
  const newGrid = FF.getImmutableGrid()
    .map(e => e.map(r => r.get('direction')))
    .toArray();
  expect(newGrid[0]).toEqual(List.of([0, 0], [0, -1], [0, -1], [0, -1]));
  expect(newGrid[1]).toEqual(List.of([-1, 0], [-1, -1], [-1, -1], [-1, -1]));
  expect(newGrid[2]).toEqual(List.of([-1, 0], [-1, -1], [-1, -1], [-1, -1]));
  expect(newGrid[3]).toEqual(List.of([-1, 0], [-1, -1], [-1, -1], [-1, -1]));
});
it('should calculate direction to target correctly 1', function() {
  const FF = createFlowField(1, 4, 4);
  const grid = FF.getGrid();
  FF.setObstacle([1, 0]);
  FF.setTarget([0, 0]);
  FF.updateDistance();
  FF.updateVectorField();
  const newGrid = FF.getImmutableGrid()
    .map(e => e.map(r => r.get('direction')))
    .toArray();
  expect(newGrid[0]).toEqual(List.of([0, 0], [0, -1], [0, -1], [0, -1]));
  expect(newGrid[1]).toEqual(List.of([0, 0], [-1, 0], [-1, -1], [-1, -1]));
  expect(newGrid[2]).toEqual(List.of([0, 1], [-1, 0], [-1, -1], [-1, -1]));
  expect(newGrid[3]).toEqual(List.of([-1, 1], [-1, 0], [-1, -1], [-1, -1]));
});
it('should calculate direction to target correctly 2', function() {
  const FF = createFlowField(1, 4, 4);
  const grid = FF.getGrid();
  FF.setObstacle([1, 0]);
  FF.setObstacle([1, 1]);
  FF.setTarget([0, 0]);
  FF.updateDistance();
  FF.updateVectorField();
  const newGrid = FF.getImmutableGrid()
    .map(e => e.map(r => r.get('direction')))
    .toArray();
  expect(newGrid[0]).toEqual(List.of([0, 0], [0, -1], [0, -1], [0, -1]));
  expect(newGrid[1]).toEqual(List.of([0, 0], [0, 0], [-1, 0], [-1, -1]));
  expect(newGrid[2]).toEqual(List.of([0, 1], [0, 1], [-1, 0], [-1, -1]));
  expect(newGrid[3]).toEqual(List.of([-1, 1], [-1, 1], [-1, 0], [-1, -1]));
});
