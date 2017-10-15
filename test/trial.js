var expect = require("expect");
var createFlowField = require("../FlowField2").default;
console.log(createFlowField);
describe("FlowField", function() {
  describe("flowfield creation", function() {
    it("should create a flowfield", () => {
      expect(createFlowField(20, 200, 200)).toBe(Object);
    });
  });
});
