# Flowfield Manager

This library provides a pathfinding mechanism based on vectors field.

You can find a working example here : [Live Example](http://www.apprendre-react.fr/flowfield/)
## Getting Started

### Installation 
Download the package with **yarn**
`yarn add FlowField`
or **npm** with `npm install FlowField`

### Basics example
```
  import flowfield from FlowField;
  //create the flowfield
  const FF = flowfield.create(1, 20, 20); //Create a grid of 10x10
  FF.setTarget([2,2]); //add a target
  FF.addObstacle([3,3]);
  FF.addObstacle([7,2]);
  const path = FF.getPathFromCoordinates([8,9]); //return array of position to reach the target in [2,2] from [8,9];
```

### The API
#### Basic types

* **Flowfield** : Object containing the Grid and all the following methods.

* **Grid** : `Array<Array<Cell>>`.

* **Cell** : `Object` containing several attributes
  * distance : `Number` - number of cells between the current cell and the target
  * direction : `Array<Number>` - normalized direction from the cell to the target
  * obstacle : `boolean` - describing whether the cell is an obstacle


#### Methods 

* **create**

`create( step: number, height: number, width: number): FlowField Object`

  Create a flowfield based on `step`, `height` and `number`.
  
  The size of the grid it is about to create is simply `[height/step ,width/step`].

  >For example, `flowfield.create(2, 10, 10)` will create a grid of `5 x 5` cells.


* **setTarget**
  
  `setTarget(position: Array<number>) : Grid`
  
  Set the target of the flowfield

* **setObstacle**

  `setObstacle(position: Array<number>) : Grid`
  
  Given the position provided, adds an obstacle on the flowfield. This cell will be therefore avoided to calculate path.

* **removeObstacle**

  `removeObstacle(position: Array<number>) : Grid`

  If the cell at the given position is an obstacle, set it back as a regular cell. Does nothing otherwise.

*  **getPathFromCoordinates**

  `getPathFromCoordinates(position: Array<number>) : Array<Array<Number>>`

  Given a position, returns an array containing the coordinates of the path to go from the given cell to the target of the flowfield.

* **getGrid**

  `getGrid() : Array<Array<Object>>`

  Returns the entire grid.

* **getImmutableGrid**
    
    `getImmutableGrid : List<List<Map>>`
  
  Returns the Immutable object representing the grid. Might be relevant if [Immutable.js](https://facebook.github.io/immutable-js/) is used in your project

* **getCell**

  `getCell(position: Array<number>) : Object`

  From the position provided, it returns the object representing the cell. 

* **getCellFromRealWorldCoordinates**
  
  `getCellFromRealWorldCoordinates(position: Array<number>) : Cell`
  
  From the "real world coordinates" position provided, it returns the object representing the cell. 

  >For example, with a `flowfield.create(2, 10, 10)`, `getCell(3,3) will return the cell located in [1,1] in the grid space.`. 

#### TODO
  * setObstacleFromWorldCoordinates

  Same as before except that it takes "real world coordinates". Meaning that the conversion to the grid system will be done automatically based on 
  the step parameter provided at the Flowfield creation.

  * removeObstacleFromWorldCoordinates

  Same as before but with "real world coordinates".

## Running the tests

To run them :

```
yarn test
```

### Tests purposes

Just trying to get a 100% coverage...

## Roadmap
  - Code refactoring to remove duplications
  - Tests cleaning to improve readability
  - Deal with some edge cases where not the fastest way is not chosen (based on how the next cell to go is chosen based on a distance comparison to the target). One possibility would be a post-process on the path calculated.
  - make the `step` parameter optionnal.
  - use a caching method to store paths to save computing time as long as the grid is not modified (e.g. no new target/obstacles)
  - usage of web workers as an option to release main thread.

## Contributing

Feel free to help and improve this library by opening a PR. As said previously, this is a first version that matches my use cases for now but I'm open to improvements :) 

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Author

* **Gaël Servaud** - *Initial work* - [My profile](https://github.com/GaelS)

## License

This project is licensed under the ISC License.