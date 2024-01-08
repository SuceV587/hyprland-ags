import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import meoryVaribale from "../../variables/memory.js";

const mainCover = (avg_row_px)=>{
  const widget= Widget.Box({
    css:`background-color:rgba(0,0,0,0.3);min-height:${avg_row_px}px;border-radius:1.5rem`,

  })

  return widget

}


const wellKnow = (avg_row_px)=>{


  const widget = Widget.Box({
    hpack: "fill",
    vpack: "fill",
    vertical: true,
    css: `min-width:${avg_row_px * 2}px;min-height:${avg_row_px}px;background-color:rgba(232,232,232,0.8);;border-radius:1.5rem;background-image:url('/home/amao/.config/awesome/wallpapers/bg2.jpg');background-size:cover;`,
    children:[
      // mainCover(avg_row_px)
    ]
  });

  return widget;
}

export default wellKnow
