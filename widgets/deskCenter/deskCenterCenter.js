import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { dateWidget } from "./date.js";
import { calendar } from "./calendar.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import todo from "./todo.js";
import music from "./music.js"


const centerWidgets = (desk_widget_spacing) => {
  //第一列
  const row_1 = Widget.Box({
    className: "f-row1",
    spacing: desk_widget_spacing,
    vpack: "fill",
    hpack: "fill",
    setup: (self) => {
      Utils.timeout(500, () => {
        const width = self.get_allocated_width();
        const avagRow = Math.floor((width - desk_widget_spacing) / 4);
        self.children = [
          dateWidget(avagRow),
          calendar(avagRow),
        ];
      });
    },
  });

  const row_2 = Widget.Box({
    className: "f-row1",
    spacing: desk_widget_spacing,
    vpack: "fill",
    hpack: "fill",
    setup: (self) => {
      Utils.timeout(500, () => {
        const width = self.get_allocated_width();
        const avagRow = Math.floor((width - desk_widget_spacing) / 4);
        self.children = [
          todo(avagRow),
          music(avagRow)
        ];
      });
    },
  });

  const mainWrap = Widget.Box({
    className: "f-desk-center",
    // css: `min-width:${avg_row_px * 8}px`,
    homogeneous: true,
    vpack: "fill",
    hpack: "fill",
    vertical: true,
    spacing: desk_widget_spacing,
    children: [
      row_1,
      row_2,
    ],
  });
  return mainWrap;
};

export default centerWidgets;
