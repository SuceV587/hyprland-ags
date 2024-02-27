import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import Widget from "resource:///com/github/Aylur/ags/widget.js";

import lunar from "../../lib/lunarCalendar.js";

export const calendar = (avg_row_px) => {
  const row_height = avg_row_px;

  const top_part = Widget.Box({
    css: `min-height:${
      row_height * 1 / 4
    }px;border-top-left-radius:1.5rem;border-top-right-radius:1.5rem;`,
    vertical: true,
    children: [
      Widget.Label({
        css: `font-size:1rem;color:#ff5a5d;font-weight:800`,
        setup: (self) =>
          Utils.timeout(1, () => {
            const styleContext = self.get_parent().get_style_context();
            const height = styleContext.get_property(
              "min-height",
              Gtk.StateFlags.NORMAL,
            );
            self.setCss(`min-height:${height}px;font-size:1rem;color:#ff5a5d;font-weight:800`);

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            self.label = currentYear + "年" + currentMonth + "月";
          }),
      }),
    ],
  });

  const topWeek = Widget.Box({
    vertical: false,
    homogeneous: true,
    vpack: "fill",
    hpack: "fill",
    css: `min-height:${
      row_height * 3 / 28
    }px;font-size:0.8rem;font-weight:800;color:#000`,
    setup: (self) => {
      const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const childArr = [];
      weeks.map((labeltxt) => {
        const widget = Widget.Label({
          label: labeltxt,
        });
        childArr.push(widget);
      });
      self.children = childArr;
    },
  });

  const computeCalc = (weeks) => {
    const widget = Widget.Box({
      vertical: false,
      homogeneous: true,
      vpack: "fill",
      hpack: "fill",
      css: `min-height:${row_height * 3 / 28 - 5}px;font-size:0.8rem;font-weight:600;color:#333;`,
      setup: (self) => {
        const childArr = [];
        weeks.map((oneday) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
          let dayTxt=""
          if (currentMonth == oneday.month) {
            let extend = "";
            dayTxt = oneday.day + extend;
          } 
          const widget = Widget.Label({
            label:dayTxt,
            setup: (self) => {
              if (oneday.day == currentDay && oneday.month === currentMonth) {
                self.setCss("color:#ff5a5d;font-size:0.8rem;font-weight:600;");
              }
            },
          });
          childArr.push(widget);
        });
        self.children = childArr;
      },
    });
    return widget;
  };

  const bottom_part = Widget.Box({
    css: `min-height:${
      row_height * 3 / 4
    }px;border-top-left-radius:1.5rem;border-top-right-radius:1.5rem;`,
    vertical: true,
    setup: (self) => {
      Utils.timeout(10, () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const calendars = lunar.calendar(currentYear, currentMonth, true);

        const calc = calendars.monthData;

        const groupedArray = Array.from(
          { length: Math.ceil(calc.length / 7) },
          (_, index) => {
            const start = index * 7;
            const end = start + 7;
            return calc.slice(start, end);
          },
        );

        const widgetContent = [topWeek];
        groupedArray.map((weeks) => {
          const weekWidget = computeCalc(weeks);
          widgetContent.push(weekWidget);
        });

        self.children = widgetContent;
      });
    },
  });

  const main_box = Widget.Box({
    vertical: true,
    children: [
      top_part,
      bottom_part,
    ],
  });

  const widget = Widget.Box({
    className: "f-date-calc",
    vertical: true,
    hpack: "fill",
    vpack: "fill",
    css: `background-color:#fff;min-width:${
      avg_row_px * 2
    }px;border-radius:1.5rem;`,
    children: [
      main_box,
    ],
  });

  return widget;
};
