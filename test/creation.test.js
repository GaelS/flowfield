var expect = require("expect");
var { Map } = require("immutable");
var createFlowField = require("../FlowField2").default;

describe("FlowField", function() {
  const flowfield = createFlowField(20, 200, 200);

  describe("creation", function() {
    it("should return an object", function() {
      expect(typeof flowfield).toBe("object");
    });

    it("should return an object containing an grid of 10 by 10", function() {
      const rows =
        flowfield.getGrid().filter(row => row.size === 10).size === 10;
      const columns = flowfield.getGrid().size === 10;
      expect(rows && columns).toBeTruthy();
    });

    it("should return an grid containing cells with distance, direction and updated properties", function() {
      const cell = flowfield.getCell(0, 0);
      expect(cell).toEqual(
        expect.objectContaining(
          Map({
            distance: expect.any(Number),
            updated: expect.any(Boolean),
            direction: expect.any(Array)
          })
        )
      );
    });
  });
});
