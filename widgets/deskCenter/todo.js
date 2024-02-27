import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import todoUse from "../../variables/todo.js";

const topPart = (avg_row_px) => {
  const widget = Widget.Box({
    vpack: "center",
    css: `min-height:${avg_row_px * 1 / 4
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

const bottomPart = (avg_row_px) => {
  const widget = Widget.Box({
    vertical:true,
    children: [],
  });

  const todoLable = (content = "") => {
    const widget = Widget.Box({
      css:"border-bottom:1px dotted  #999;margin-left:10px;margin-right:10px;padding-bottom:5px",
      children: [
        Widget.Label({
          vpack:"center",
          css: "color:#000;font-size:0.9rem;padding-top:10px;",
          label: content,
        }),
      ],
    });

    return widget;
  };

  widget.hook(todoUse, (self) => {
    const childWidges = [];
    todoUse.value.map((item) => {
      const widget = todoLable(item.Itime+" "+item.Content);
      childWidges.push(widget);
    });
    self.children = childWidges;
  }, "changed");

  return widget;
};

const todo = (avg_row_px) => {
  const widget = Widget.Box({
    hpack: "fill",
    vpack: "fill",
    vertical: true,
    css: `min-width:${avg_row_px * 2
      }px;min-height:${avg_row_px}px;background-color:#fff;border-radius:1.5rem;`,
    children: [
      topPart(avg_row_px),
      bottomPart(avg_row_px),
    ],
  });

  return widget;
};

export default todo;
