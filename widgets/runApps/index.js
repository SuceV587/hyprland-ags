
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import mainBox from "./main.js"


const runApps = (monitor) => {
  const win = Widget.Window({
    monitor,
    name: `runApps`,
    // anchor: ["top"],
    child: mainBox(),
    popup: true,
    layer: "top", //可以被覆盖在底层。相当于css里面z-index较低的层级
    keymode: "on-demand",
    visible: false,
  });
  return win;
};

export default runApps;
