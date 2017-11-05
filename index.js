import manager from "./FlowField2";

const FF = manager(1, 50, 50);
const grid = FF.getGrid();
FF.setTarget([0, 0]);
FF.updateDistance();
//console.log(FF.getGrid());
