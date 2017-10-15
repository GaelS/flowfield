import _ from "lodash";

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
    this.grids = {};
  }
  /*
    **Update grid when a new building is added
    */
  updateGrid(buildingsExtend) {
    buildingsExtend.forEach(extend => {
      let xTile = getTileNumber(extend[0], this.step);
      let zTile = getTileNumber(extend[1], this.step);
      this.initialGrid[xTile][zTile].distance = 9999;
      this.initialGrid[xTile][zTile].updated = true;
    });
  }
  /*
    ** Update distance values
    ** of the grid when
    ** new target is set
    */
  updateDistanceValue(target) {
    let { targetTileX, targetTileZ } = getCorrectedTiles(
      target,
      this.xMax,
      this.zMax,
      this.step
    );

    const idGrid = `${targetTileX}${targetTileZ}`;
    //reset grid
    //except for cell containing building
    this.grids[idGrid] = _.cloneDeep(this.initialGrid).map(row => {
      return row.map(cell => {
        cell.updated = cell.distance === 9999 ? true : false;
        return cell;
      });
    });
    //set tile target to 0
    this.grids[idGrid][targetTileX][targetTileZ].distance = 0;
    this.grids[idGrid][targetTileX][targetTileZ].updated = true;
    let tilesTarget = [[targetTileX, targetTileZ]];
    let tilesToGoThrough = [];
    let distance = 1;
    //loop to go through
    //while not all elements in
    //this.grid are updated
    //with distance value from new target
    do {
      //loop through all current tiles selected
      //start with target tile clicked
      tilesTarget.forEach(tile => {
        _([this.grids[idGrid][tile[0]][tile[1]]])
          .filter(cell => cell.distance !== 9999)
          .forEach(currentTile => {
            //only update neighbours' cell
            //for cell without buildings on it
            let tilesToUpdate = getNeighbours(
              tile[0],
              tile[1],
              this.xMax,
              this.zMax,
              this.step
            );
            updateDistance(this.grids[idGrid], tilesToUpdate, distance);
            tilesToGoThrough.push(tilesToUpdate);
          });
      });
      //Get all neightbours from current tile that needs
      //to get distance value updated
      tilesTarget = _(tilesToGoThrough)
        //tilesToGoThrough array of array
        //=> needs to be flattened
        .flatten()
        //join tuple in string
        .map(tile => tile.join(","))
        //remove duplicates
        .uniq()
        //get tuple of int back
        .map(tile => tile.split(",").map(e => parseInt(e, 10)));

      tilesToGoThrough = [];
      distance = distance + 1;
      //console.timeEnd('2')
    } /* Still going while not everything updated */ while (_.chain(
      this.grids[idGrid]
    )
      .flatten()
      .filter(cell => !cell.updated)
      .value().length !== 0);
  }

  updateVectorField(target) {
    let { targetTileX, targetTileZ } = getCorrectedTiles(
      target,
      this.xMax,
      this.zMax,
      this.step
    );
    const idGrid = `${targetTileX}${targetTileZ}`;
    //tmp
    a.forEach(id => this.scene.getMeshByID(id).dispose());
    a = [];
    let newGrid = this.grids[idGrid].map((row, i) => {
      return row.map((cell, j) => {
        let distance = cell.distance === 9999 ? -9999 : cell.distance;
        cell.direction = getDirection(
          i,
          j,
          distance,
          this.xMax,
          this.zMax,
          this.step,
          this.grids[idGrid]
        );
        return cell;
      });
    });
    this.grids[idGrid] = newGrid;
  }

  getTile(position, target) {
    let { targetTileX, targetTileZ } = getCorrectedTiles(
      target,
      this.xMax,
      this.zMax,
      this.step
    );
    const idGrid = `${targetTileX}${targetTileZ}`;
    return this.grids[idGrid][getTileNumber(position.x, this.step)][
      getTileNumber(position.z, this.step)
    ];
  }
  cleanGrid(target) {
    let { targetTileX, targetTileZ } = getCorrectedTiles(
      target,
      this.xMax,
      this.zMax,
      this.step
    );
    delete this.grids[`${targetTileX}${targetTileZ}`];
  }
  //Get mean position of a tile
  getTileCenter(position) {
    let { targetTileX, targetTileZ } = getCorrectedTiles(
      position,
      this.xMax,
      this.zMax,
      this.step
    );
    let distance = this.initialGrid[targetTileX][targetTileZ].distance;
    let mean = (pt1, pt2, distance, step) => (pt1 * step + pt2 * step) / 2;
    let meanX = mean(targetTileX, targetTileX + 1, distance, this.step);
    let meanZ = mean(targetTileZ, targetTileZ + 1, distance, this.step);
    return {
      meanX,
      meanZ,
      available: distance !== 9999
    };
  }
}

//utils
// function checkPointInsideTile(tile, point, step) {
//     return point.x < (tile.x + step) && point.x > tile.x &&
//         point.z < (tile.z + step) && point.z > tile.z;
// }

function getNeighbours(x, z, xMax, zMax, step) {
  // neighbours order
  // 1 8 7
  // 2   6
  // 3 4 5
  const tooBigZ = z + 1 >= zMax;
  const tooSmallZ = z - 1 < 0;
  const tooBigX = x + 1 >= xMax;
  const tooSmallX = x - 1 < 0;
  return _.compact([
    !tooSmallX && !tooBigZ ? [x - 1, z + 1] : null,
    !tooSmallX ? [x - 1, z] : null,
    !tooSmallX && !tooSmallZ ? [x - 1, z - 1] : null,
    !tooSmallZ ? [x, z - 1] : null,
    !tooBigX && !tooSmallZ ? [x + 1, z - 1] : null,
    !tooBigX ? [x + 1, z] : null,
    !tooBigX && !tooBigZ ? [x + 1, z + 1] : null,
    !tooBigZ ? [x, z + 1] : null
  ]);
}

function getGridNeighbours(x, z, xMax, zMax, grid) {
  let coords = getNeighbours(x, z, xMax, zMax);
  return coords.map(coord => (!!coord ? grid[coord[0]][coord[1]] : null));
}

function getMinimumNeighbour(x, z, currentDistance, xMax, zMax, step, grid) {
  let neighbours = getGridNeighbours(x, z, xMax, zMax, grid);
  //Get neightboor with largest difference
  // => going toward target fastest

  return _(neighbours)
    .map((cell, i) => [i, !!cell ? cell.distance : -1])
    .compact()
    .minBy(cell => cell[1])[0];
}
//Return vector direction for a cell
function getDirectionFromIndex(index) {
  // neighbours order
  // 1 8 7
  // 2   6
  // 3 4 5
  return (
    [[-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1]][
      index
    ] || [0, 0]
  );
}

function getDirection(x, z, distance, xMax, zMax, step, grid) {
  return distance === 0
    ? [0, 0]
    : getDirectionFromIndex(
        getMinimumNeighbour(x, z, distance, xMax, zMax, step, grid)
      );
}

function updateDistance(grid, tilesToUpdate, distance) {
  //update every selected cells
  //with new distance value
  tilesToUpdate
    //filter already updated tile
    .filter(([x, z]) => !grid[x][z].updated)
    .forEach(([x, z]) => {
      grid[x][z] = { ...grid[x][z], distance, updated: true };
    });
}

function getTileNumber(point, step) {
  return Math.floor(point / step);
}
//function to get tile indices
//corrected if map edges are reached
function getCorrectedTiles(target, xMax, zMax, step) {
  let tmpTargetTileX = getTileNumber(target.x, step);
  let tmpTargetTileZ = getTileNumber(target.z, step);
  //corrected target if
  //map edges are reached
  let targetTileX = tmpTargetTileX === 0
    ? 1
    : tmpTargetTileX === xMax - 1 ? tmpTargetTileX - 1 : tmpTargetTileX;
  let targetTileZ = tmpTargetTileZ === 0
    ? 1
    : tmpTargetTileZ === zMax - 1 ? tmpTargetTileZ - 1 : tmpTargetTileZ;
  return {
    targetTileX,
    targetTileZ
  };
}
