var expect = require("expect");
var createFlowField = require("../FlowField2").default;
var {
  getCorrectedTileIndices,
  getNeighbours,
  updateDistance
} = require("../basicFunctions").default;
var { Map } = require("immutable");

describe("Functions behavior", function() {
  describe("getNeighbours", function() {
    it("should return an grid containing positions of the 3 cell's neighbours located in 0,0", function() {
      const cells = getNeighbours([0, 0]);
      expect(cells.length).toEqual(3);
    });
    it("should return an empty list", function() {
      const cells = getNeighbours([-1, -1]);
      expect(cells.length).toEqual(0);
    });
  });
  describe("getTileNumber", function() {
    it("should return [0,0] for ", function() {
      const indices = getCorrectedTileIndices([5.5, 18.2], 20);
      expect(indices).toEqual([0, 0]);
    });
    it("should throw an exception when one of the args is negative", function() {
      const A = getCorrectedTileIndices.bind(null, [5.5, 18.2], -1);
      const B = getCorrectedTileIndices.bind(null, [-5.5, 18.2], 1);
      const C = getCorrectedTileIndices.bind(null, [5.5, -18.2], 1);
      expect(A).toThrow();
      expect(B).toThrow();
      expect(C).toThrow();
    });
    it("should add a new target and remove the previous one", function() {
      const FF = createFlowField(1, 2, 2);
      const grid = FF.getGrid();
      FF.setTarget([0, 0]);

      expect(FF.getGrid().getIn([0, 0])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );

      FF.setTarget([0, 1]);

      expect(FF.getGrid().getIn([0, 0])).not.toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
      expect(FF.getGrid().getIn([0, 1])).toEqual(
        Map({ distance: 0, updated: true, direction: [0, 0], obstacle: false })
      );
    });
  });
});
