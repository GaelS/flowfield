/* @flow */
export default function(step: Number, xRange: Number, yRange: Number) {
  console.log(step);
  return {};
} /* 
export default class FlowField {
  constructor(groundMesh, scene) {
    this.scene = scene;
    this.step = 25; //hardcoded for now
    this.xMax = groundMesh._maxX * 2 / this.step;
    this.zMax = groundMesh._maxZ * 2 / this.step;
    this.initialGrid = _.range(0, this.xMax).map(ptX => {
      return _.range(0, this.zMax).map(ptZ => {
        let mapLimites =
          ptX === 0 ||
          ptZ === 0 ||
          ptX === this.xMax - 1 ||
          ptZ === this.zMax - 1;
        return {
          distance: mapLimites ? 9999 : -1,
          updated: mapLimites ? true : false,
          direction: [0, 0] //x, z components
        };
      });
    });
  }
} */
