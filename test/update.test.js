var expect = require("expect");
var createFlowField = require("../FlowField2").default;
var { addBuilding } = require("../basicFunctions").default;
var { Map } = require("immutable");

describe("FlowField", function() {
  const flowfield = createFlowField(1, 2, 2);

  describe("update", function() {
    it("should", function() {
      const FF = createFlowField(1, 4, 4);
      const grid = FF.getGrid();
      FF.setTarget([0, 0]);
      FF.updateDistance();
      expect(FF.getGrid()).toBe(true);
    });
  });
});
