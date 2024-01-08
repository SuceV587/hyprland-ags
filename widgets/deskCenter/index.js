const { Gdk, Gtk } = imports.gi;
import deskCenterLeft from "./deskCenterLeft.js";
import deskCenterCenter from "./deskCenterCenter.js";
import deskCenterRight from "./deskCenterRight.js"
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import monitors from "../../lib/monitors.js";

//每个组件之间的spacing
const desk_widget_spacing = 25;

const mainBox = Widget.Box({
  homogeneous:true,
  spacing:desk_widget_spacing,
  children:[
    deskCenterLeft(desk_widget_spacing),
    deskCenterCenter( desk_widget_spacing),
    deskCenterRight(desk_widget_spacing)
  ],
});

const deskCenter = (monitor) => {
  const win = Widget.Window({
    monitor,
    name: `dock_center_left`,
    margins: [50, desk_widget_spacing, 0, desk_widget_spacing],
    anchor: ["top", "left", "right"],
    child: mainBox,
    layer: "background", //可以被覆盖在底层。相当于css里面z-index较低的层级
  });
  return win;
};

export default deskCenter;
