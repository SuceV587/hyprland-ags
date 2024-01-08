import Widget from "resource:///com/github/Aylur/ags/widget.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

import lunar from "../../lib/lunarCalendar.js";

export const dateWidget = (avg_row_px) => {
  const row_height = avg_row_px;

  const top_part = Widget.Box({
    css: `background-color:#ff5a5d;color:#fff;min-height:${
      row_height * 1 / 4
    }px;border-top-left-radius:1.5rem;border-top-right-radius:1.5rem`,
    vertical: true,
    children: [
      Widget.Label({
        css: `font-size:1.2rem;font-weight:800`,
        setup: (self) =>
          Utils.timeout(1, () => {
            const styleContext = self.get_parent().get_style_context();
            const height = styleContext.get_property(
              "min-height",
              Gtk.StateFlags.NORMAL,
            );
            self.setCss(`min-height:${height}px`);

            // 获取当前年份
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            self.label = currentYear + "年 " + currentMonth + "月";
          }),
      }),
    ],
  });

  const center_part = Widget.Box({
    css: `min-height:${row_height * 2 / 4}px;`,
    vertical: true,
    children: [
      Widget.Label({
        css: `font-size:2.8rem;font-weight:800;color:#000`,
        setup: (self) =>
          Utils.timeout(1, () => {
            const styleContext = self.get_parent().get_style_context();
            const height = styleContext.get_property(
              "min-height",
              Gtk.StateFlags.NORMAL,
            );
            self.setCss(`min-height:${height}px`);

            const currentDate = new Date();
            // 获取当前日期
            const currentDay = currentDate.getDate();

            // 获取当前日期是一周的第几天
            const dayOfWeek = currentDate.getDay();

            // 定义星期数组
            const daysOfWeek = [
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
            ];

            // 获取星期几的字符串表示
            const dayOfWeekString = daysOfWeek[dayOfWeek];

            self.label = currentDay + "日" + " " + dayOfWeekString;
          }),
      }),
    ],
  });

  const bottom_part = Widget.Box({
    // css: `min-height:${avg_row_px * 2 / 4}px;`,
    vertical: true,
    children: [
      Widget.Label({
        css: `font-size:0.9rem;font-weight:600;color:#000`,
        setup: (self) => {
          Utils.timeout(1, () => {
            // 创建一个 Date 对象，表示当前时间
            const currentDate = new Date();

            // 获取当前年份
            const currentYear = currentDate.getFullYear();

            // 获取当前月份（注意：月份从 0 开始，所以要加 1）
            const currentMonth = currentDate.getMonth() + 1;

            // 获取当前日期
            const currentDay = currentDate.getDate();

            // 获取当前日期是一周的第几天
            const dayOfWeek = currentDate.getDay();

            // 定义星期数组

            const daysOfWeek = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            // 获取星期几的字符串表示
            const dayOfWeekString = daysOfWeek[dayOfWeek];

            const ret = lunar.solarToLunar(
              currentYear,
              currentMonth,
              currentDay,
            );

            self.label = dayOfWeekString + " " + ret.lunarMonthName +
              ret.lunarDayName + "日";
          });
        },
      }),
    ],
  });

  const main_box = Widget.Box({
    vertical: true,
    hpack: "fill",
    vpack: "fill",
    children: [
      top_part,
      center_part,
      bottom_part,
    ],
  });

  const widget = Widget.Box({
    className: "f-date-widget",
    vertical: true,
    hpack: "fill",
    vpack: "fill",
    css: `min-width:${
      avg_row_px * 2
    }px;min-height:${row_height}px;border-radius:1.5rem;`,
    children: [
      main_box,
    ],
  });

  return widget;
};
