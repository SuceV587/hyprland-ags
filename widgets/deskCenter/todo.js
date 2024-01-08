import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import meoryVaribale from "../../variables/memory.js";

const topPart = (avg_row_px) => {
  const widget = Widget.Box({
    vpack: "center",
    css: `min-height:${
      avg_row_px * 1 / 4
    }px;background-color:#ebb800;border-top-left-radius:1.5rem;border-top-right-radius:1.5rem`,
    children: [
      Widget.Label({
        css: "color:#fff;font-size:1.1rem;font-weight:600;padding-left:1em",
        label: "备忘录",
      }),
    ],
  });

  return widget;
};

const bottomPart = (avg_row_px)=>{
  const widget= Widget.Box({
    children:[
      Widget.Label({
        css: "color:#000;font-size:0.8rem;padding-left:1em;padding-top:10px",
        label: "暂无更多备忘",
      }),
    ]

  })
  return widget
}

const todo = (avg_row_px) => {
  const widget = Widget.Box({
    hpack: "fill",
    vpack: "fill",
    vertical: true,
    css: `min-width:${
      avg_row_px * 2
    }px;min-height:${avg_row_px}px;background-color:#fff;border-radius:1.5rem;`,
    children: [
      topPart(avg_row_px),
      bottomPart(avg_row_px),
    ],
  });

  return widget;
};

export default todo;
