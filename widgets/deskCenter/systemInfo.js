import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import meoryVaribale from "../../variables/memory.js";

const circle = (width, params) => {
  const widget = Widget.CircularProgress({
    hpack: "center",
    css: `min-width:${width * 1 / 2}px;` +
      `min-height:${width * 1 / 2}px;` +
      "font-size: 18px;" +
      "background-color: #f0f0f0;" +
      "color: #00C957;",
    child: Widget.Label({
      css: "font-size:0.7rem;color:#555;font-weight:800",
      label: params.name||"MEM",
    }),
    value: 0.3,
    rounded: true,
    inverted: false,
    startAt: 0.75,
  });

  return widget;
};

const porgressBar = (width) => {
  const widget = Widget.Box({
    css:`min-width:${width * 1.3}px;`,
    vpack: "center",
    hpack:"center",
    vertical:"true",
    children: [
      Widget.ProgressBar({
        vpack: "center",
        hpack:"fill",
        // css: `min-width:${width * 1.3}px;padding:10px;background-color:#f0f0f0;min-height:14px;border-radius:12px;`,
        css :`min-height:15px;border-radius:15px;border:0;background-color:#00C957`,
        value: 0.3
      }),
      Widget.Label({
        css:"font-size:0.8rem;font-weight:800;color:#555;padding-top:10px;",
        label:"Disk Usage:30G , Avaiable:250G"
      })
    ],
  });
  return widget;
};

const makeMemoryWidget = (avg_row_px,params) => {
  const widget = Widget.Box({
    css:`padding-right:1.2rem`,
    hpack: "end",
    children: [circle(avg_row_px,params)],
  });

  //监听memeory的变换
  // widget.hook(meoryVaribale, (self) => {
  //   console.log(meoryVaribale.value);
  // }, "changed");

  return widget;
};

const makeDiskWidget = (avg_row_px,params) => {
  const widget = Widget.Box({
    css:`padding-left:1.2rem`,
    hpack: "start",
    children: [circle(avg_row_px,params)],
  });

  //监听memeory的变换
  // widget.hook(meoryVaribale, (self) => {
  //   console.log(meoryVaribale.value);
  // }, "changed");

  return widget;
};

const topPart = (avg_row_px) => {
  const widget = Widget.Box({
    homogeneous: true,
    hpack: "fill",
    vpack: "center",
    css: `min-width:${avg_row_px * 2}px;min-height:${avg_row_px * 2 / 3}px;`,
    children: [
      makeMemoryWidget(avg_row_px,{name:"CPU"}),
      makeDiskWidget(avg_row_px,{name:"MEM"}),
    ],
  });

  return widget;
};

const bottomPart = (avg_row_px) => {
  const widget = Widget.Box({
    homogeneous: true,
    vpack: "center",
    css: `min-width:${avg_row_px * 2}px;min-height:${avg_row_px * 1 / 3}px;`,
    children: [porgressBar(avg_row_px)],
  });

  return widget;
};

//计算内存和硬盘使用情况
const systemInfoWidget = (avg_row_px) => {
  const widget = Widget.Box({
    hpack: "fill",
    vertical: true,
    css: `min-width:${
      avg_row_px * 2
    }px;min-height:${avg_row_px}px;background-color:rgba(232,232,232,0.8);;border-radius:1.5rem`,
    children: [
      topPart(avg_row_px),
      bottomPart(avg_row_px),
    ],
  });

  return widget;
};

export default systemInfoWidget;
