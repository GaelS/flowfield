var expect = require('expect');
var createFlowField = require('../FlowField').default;
var {
  getCorrectedTileIndices,
  getNeighbours
} = require('../basicFunctions').default;
var { Map } = require('immutable');

describe('Functions behavior', function() {
  describe('getNeighbours', function() {
    it("should return an grid containing positions of the 3 cell's neighbours located in 0,0", function() {
      const cells = getNeighbours([0, 0], 2, 2, 1);
      expect(cells.length).toEqual(3);
    });
    it('should return an empty list', function() {
      const cells = getNeighbours([-1, -1]);
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
      const grid1 = FF.setTarget([0, 0]);

      expect(grid1.getIn([0, 0])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );

      const grid2 = FF.setTarget([0, 1]);

      expect(grid2.getIn([0, 0])).not.toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
      expect(grid2.getIn([0, 1])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
    });
    it('should add an obstacle', function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getImmutableGrid();
      const newGrid = FF.setObstacle([1, 1]);

      expect(newGrid.getIn([1, 1])).toEqual(
        Map({ distance: -1, updated: true, direction: [0, 0], obstacle: true })
      );
    });
    it('should throw when uncorrect coordinated are given to add obstacle', function() {
      const FF = createFlowField(1, 2, 2);
      const A = FF.setObstacle.bind(null, undefined);
      const B = FF.setObstacle.bind(null, []);
      const C = FF.setObstacle.bind(null, [0]);
      const D = FF.setObstacle.bind(null, [3, 0]);
      const E = FF.setObstacle.bind(null, [0, 3]);
      expect(A).toThrow();
      expect(B).toThrow();
      expect(C).toThrow();
      expect(D).toThrow();
      expect(E).toThrow();
    });
    it('should throw when uncorrect coordinated are given to set a new target', function() {
      const FF = createFlowField(1, 2, 2);
      const A = FF.setTarget.bind(null, undefined);
      const B = FF.setTarget.bind(null, []);
      const C = FF.setTarget.bind(null, [0]);
      const D = FF.setTarget.bind(null, [3, 0]);
      const E = FF.setTarget.bind(null, [0, 3]);
      expect(A).toThrow();
      expect(B).toThrow();
      expect(C).toThrow();
      expect(D).toThrow();
      expect(E).toThrow();
    });
    it('should return the given cell when correct coordinated are provided', function() {
      const FF = createFlowField(1, 2, 2);
      expect(FF.getCell([0, 1])).toEqual(
        FF.getImmutableGrid().getIn([0, 1]).toJS()
      );
    });
    it('should throw an error the given cell when uncorrect coordinated are provided', function() {
      const FF = createFlowField(1, 2, 2);
      const A = FF.getCell.bind(null, undefined);
      const B = FF.getCell.bind(null, []);
      const C = FF.getCell.bind(null, [0]);
      const D = FF.getCell.bind(null, [3, 0]);
      const E = FF.getCell.bind(null, [0, 3]);
      expect(A).toThrow();
      expect(B).toThrow();
      expect(C).toThrow();
      expect(D).toThrow();
      expect(E).toThrow();
    });
  });
});
