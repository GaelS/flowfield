var expect = require('expect');
var createFlowField = require('../FlowField').default;
var {
  getCorrectedTileIndices,
  getNeighbours,
  generateOutOfBoundsFunction
} = require('../basicFunctions').default;
var { Map } = require('immutable');

describe('Functions behavior', function() {
  describe('getNeighbours', function() {
    it("should return an grid containing positions of the 3 cell's neighbours located in 0,0", function() {
      const FF = createFlowField(1, 2, 2);
      const outOfBounds = generateOutOfBoundsFunction(2, 2);
      const cells = getNeighbours([0, 0], outOfBounds, FF.getImmutableGrid());
      expect(cells.length).toEqual(3);
    });
    it('should return an empty list', function() {
      const FF = createFlowField(1, 2, 2);
      const outOfBounds = generateOutOfBoundsFunction(2, 2);
      const cells = getNeighbours([-1, -1], outOfBounds, FF.getImmutableGrid());
      expect(cells.length).toEqual(0);
    });
  });
  describe('getTileNumber', function() {
    it('should return [0,0] for ', function() {
      const indices = getCorrectedTileIndices([5.5, 18.2], 20);
      expect(indices).toEqual([0, 0]);
    });
    it('should throw an exception when one of the args is negative', function() {
      const A = getCorrectedTileIndices.bind(null, [5.5, 18.2], -1);
      const B = getCorrectedTileIndices.bind(null, [-5.5, 18.2], 1);
      const C = getCorrectedTileIndices.bind(null, [5.5, -18.2], 1);
      expect(A).toThrow();
      expect(B).toThrow();
      expect(C).toThrow();
    });
    it('should add a new target and remove the previous one', function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getImmutableGrid();
      FF.setTarget([0, 0]);
      const grid1 = FF.getImmutableGrid();
      expect(grid1.getIn([0, 0])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
      FF.setTarget([0, 1]);
      const grid2 = FF.getImmutableGrid();
      expect(grid2.getIn([0, 0]).get('distance')).not.toEqual(0);
      expect(grid2.getIn([0, 1])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
    });
    it('should add an obstacle', function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getImmutableGrid();
      FF.setObstacle([1, 1]);
      expect(FF.getImmutableGrid().getIn([1, 1])).toEqual(
        Map({ distance: -1, updated: true, direction: [0, 0], obstacle: true })
      );
    });
    it('should return unmodified grid when uncorrect coordinated are given to add obstacle', function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getImmutableGrid();
      const A = FF.setObstacle(undefined);
      const gridA = FF.getImmutableGrid();
      const B = FF.setObstacle([]);
      const gridB = FF.getImmutableGrid();
      const C = FF.setObstacle([0]);
      const gridC = FF.getImmutableGrid();
      const D = FF.setObstacle([3, 0]);
      const gridD = FF.getImmutableGrid();
      const E = FF.setObstacle([0, 3]);
      const gridE = FF.getImmutableGrid();

      expect(gridA).toEqual(grid);
      expect(gridB).toEqual(grid);
      expect(gridC).toEqual(grid);
      expect(gridD).toEqual(grid);
      expect(gridE).toEqual(grid);
    });
    it('should throw when uncorrect coordinated are given to set a new target', function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getImmutableGrid();
      const A = FF.setTarget(undefined);
      const gridA = FF.getImmutableGrid();
      const B = FF.setTarget([]);
      const gridB = FF.getImmutableGrid();
      const C = FF.setTarget([0]);
      const gridC = FF.getImmutableGrid();
      const D = FF.setTarget([3, 0]);
      const gridD = FF.getImmutableGrid();
      const E = FF.setTarget([0, 3]);
      const gridE = FF.getImmutableGrid();

      expect(gridA).toEqual(grid);
      expect(gridB).toEqual(grid);
      expect(gridC).toEqual(grid);
      expect(gridD).toEqual(grid);
      expect(gridE).toEqual(grid);
    });
    it('should return the given cell when correct coordinated are provided', function() {
      const FF = createFlowField(1, 2, 2);
      expect(FF.getCell([0, 1])).toEqual(
        FF.getImmutableGrid().getIn([0, 1]).toJS()
      );
    });
    it('should return undefined when calling getCell with uncorrect coordinated', function() {
      const FF = createFlowField(1, 2, 2);
      const A = FF.getCell(undefined);
      const B = FF.getCell([]);
      const C = FF.getCell([0]);
      const D = FF.getCell([3, 0]);
      const E = FF.getCell([0, 3]);
      expect(A).toEqual(undefined);
      expect(B).toEqual(undefined);
      expect(C).toEqual(undefined);
      expect(D).toEqual(undefined);
      expect(E).toEqual(undefined);
    });
  });
  it('should throw an error when calculating outOfBounds function absed on wrong arguments', function() {
    expect(generateOutOfBoundsFunction.bind(null, -1, -1)).toThrow();
    expect(generateOutOfBoundsFunction.bind(null, undefined, 1)).toThrow();
    expect(generateOutOfBoundsFunction.bind(null, 1, undefined)).toThrow();
    expect(generateOutOfBoundsFunction.bind(null)).toThrow();
  });
  it('should provide correct cell based on real world coordinates', function() {
    const FF = createFlowField(25, 100, 100);
    const FFBis = createFlowField(2, 20, 20);
    const cell = FF.getCellFromRealWorldCoordinates([90, 90]);
    const cellBis = FF.getCellFromRealWorldCoordinates([-10, 90]);
    const cellTer = FFBis.getCellFromRealWorldCoordinates([15, 5]);
    const cellQ = FFBis.getCellFromRealWorldCoordinates([2.5, 2]);

    expect(cell).toEqual(FF.getImmutableGrid().getIn([3, 3]).toJS());
    expect(cellBis).not.toBeDefined();
    expect(cellTer).toEqual(FFBis.getImmutableGrid().getIn([7, 2]).toJS());
    expect(cellQ).toEqual(FFBis.getImmutableGrid().getIn([1, 0]).toJS());
  });
});
