# Flowfield Manager

This library is to provide a pathfinding mechanism based on vectors field.

You can find a working example here : [Live Example](http://www.apprendre-react.fr/flowfield/)
## Getting Started

Download the package either from npm or yarn via :
`yarn add flowfield`


`import flowfield from flowfield`;

```
  //create the flowfield
  const FF = flowfield(1, 20,20); //Create a grid of 10x10
  FF.setTarget([2,2]); //add a target
  FF.addObstacle([3,3]);
  FF.addObstacle([7,2]);
  const path = FF.getPathFromCorrdinates([8,9]); //return array of position to reach the target in [2,2] from [8,9];
```

### The API

#### flowfield(step: number, height: number, width: number): FlowField
  Create the flowfield based on step, height and number.
  To get the size of the grid you are about to create, it is simply `height/step x width/step`.
  For example, `flowfield(2, 10, 10)` will create a grid of 5x5.
#### setTarget(position: Array<number>) : Grid
  Defines a new target on the flowfield
#### setObstacle(position: Array<number>) : Grid
  Add an obstacle on the flowfield. This cell will be therefore avoided to calculate path.
#### removeObstacle(position: Array<number>) : Grid
  Remove an obstacle on the flowfield.
#### TODO: setObstacleFromWorldCoordinates
  Same as before except that it takes "real world coordinates". Meaning that the conversion to the grid system will be done automatically based on 
  the step parameter provided at the Flowfield creation.
#### TODO: removeObstacleFromWorldCoordinates
  Same as before but with "real world coordinates".
#### getPathFromCoordinates(position: Array<number>) : Array<Array<Number>>
  Given a position (eg : [x,y]), it return an array containing the coordinates of the path to go from the given position to the target.
#### getGrid() : Array<Array<Object>>
  Returns the entire grid.
#### getImmutableGrid : List<List<Map>>
  Returns the immutable object representing the grid. Might be useful if immutable is used in your project
#### getCell(position: Array<number>) : Object
  From the position provided, it returns the object representing the cell. 
#### getCellFromRealWorldCoordinates(position: Array<number>) : Cell
  From the "real world coordinates" position provided, it returns the object representing the cell. 

## Running the tests

To run them :

```
yarn test
```

### Tests purposes

Just tryin' to get a 100% coverage...

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

## Authors

* **Gaël Servaud** - *Initial work* - [My profile](https://github.com/GaelS)

## License

This project is licensed under the ISC License.

## Acknowledgments

My mum.