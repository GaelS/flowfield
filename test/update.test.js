var expect = require("expect");
var createFlowField = require("../FlowField2").default;
var { addBuilding } = require("../basicFunctions").default;
var { Map } = require("immutable");

describe("FlowField", function() {
  const flowfield = createFlowField(1, 2, 2);

  describe("update", function() {
    it("should return a new grid when calling updateGrid and update the cell accordingly", function() {
      const oldGrid = flowfield.getGrid();
      const fn = grid =>
        grid.map(row => {
          const cell = row
            .get(1)
            .set("distance", 2)
            .set("updated", true)
            .set("direction", [2, 1]);
          return row.set(0, cell);
        });
      const grid = flowfield.updateGrid(fn);
      expect(flowfield.getGrid()).not.toEqual(oldGrid);
      expect(grid.get(1).get(0)).toEqual(
        Map({
          distance: 2,
          updated: true,
          direction: [2, 1],
          obstacle:false,
        })
      );
    });
    it("should not update the grid wthen calling with bad position position", function() {
      const oldGrid = flowfield.getGrid();
      const applyUpdateFn = flowfield.updateGrid.bind(
        null,
        addBuilding([0, 3])
      );
      expect(applyUpdateFn).toThrow();
      expect(oldGrid).toEqual(flowfield.getGrid());
    });
  });
});
