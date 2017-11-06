var expect = require("expect");
var { Map } = require("immutable");
var createFlowField = require("../FlowField").default;

describe("FlowField", function() {
  const flowfield = createFlowField(20, 200, 200);

  describe("creation", function() {
    it("should return an object", function() {
      expect(typeof flowfield).toBe("object");
    });

    it("should return an object containing an grid of 10 by 10", function() {
      const rows =
        flowfield.getImmutableGrid().filter(row => row.size === 10).size === 10;
      const columns = flowfield.getImmutableGrid().size === 10;
      expect(rows && columns).toBeTruthy();
    });
  });
});
