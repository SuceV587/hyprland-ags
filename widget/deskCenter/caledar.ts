import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js'


import lunar from "../../lib/lunarCalendar.js";


class Caledar {
  mainWidget: Gtk.Widget
  resetWidth: boolean

  constructor() {
    this.resetWidth = false
    this.mainWidget = this.init()
  }

  init() {
    return Widget.Box({
      className: "f-date",
      homogeneous: true,
      spacing: 20,
    }).on("size-allocate", (self, allocation) => {
      const width = allocation.width || 200
      if (width < 100 || this.resetWidth) {
        return
      }
      this.resetWidth = true
      const height =  (width - 20) / 3 
      self.setCss(`min-width:${width}px;min-height:${height}px;`)

      //init child
      self.children = [
        this.dateWidget(width, height),
        this.caledarWidget(width, height)
      ]
    })

  }

  dateWidget(width, heigth) {
    return Widget.Box({
      vertical: true,
      hpack: "fill",
      vpack: "fill",
      children: [
        this.dateTop(heigth),
        this.dateCenter(heigth),
        this.dateBottom(heigth),
      ],
    });


  }

  dateTop(height) {
    return Widget.Box({
      css: `background-color:#ff5a5d;color:#fff;
            min-height:${height * 1 / 4}px;
            border-top-left-radius:2rem;
            border-top-right-radius:2rem`,
      vertical: true,
      children: [
        Widget.Label({
          css: `font-size:1.2rem;font-weight:800`,
          vexpand: true,
          vpack: "center",
          setup: (self) => {
            Utils.idle(() => {
              // 获取当前年份
              const currentYear = new Date()?.getFullYear();
              const currentMonth = new Date()?.getMonth() + 1;
              self.label = currentYear + "年 " + currentMonth + "月";
            })
          }
        }),
      ],
    });

  }

  dateCenter(heigth) {
    return Widget.Box({
      css: `min-height:${heigth * 2 / 4}px;background-color:#fff`,
      vertical: true,
      children: [
        Widget.Label({
          css: `font-size:2.8rem;font-weight:800;color:#000`,
          vexpand: true,
          vpack: "center",
          setup: (self) => {
            Utils.idle(() => {
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
            })
          }
        }),
      ],
    });

  }

  dateBottom(heigth) {
    return Widget.Box({
      css: `min-height:${heigth * 1 / 4}px;
            background-color:#fff;
            border-bottom-left-radius:2rem;
            border-bottom-right-radius:2rem;`,
      vertical: true,
      children: [
        Widget.Label({
          css: `font-size:0.9rem;font-weight:600;color:#000`,
          setup: (self) => {
            Utils.idle(() => {
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
              const ret: any = lunar.solarToLunar(
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

  }

  caledarWidget(width, heigth) {
    return Widget.Box({
      vertical: true,
      children: [
        this.caledarTop(heigth),
        this.caledarBottom(heigth),
      ],
    })

  }

  caledarTop(heigth) {
    return Widget.Box({
      css: `min-height:${heigth * 1 / 4}px;
            border-top-left-radius:1.5rem;
            background:#fff;
            border-top-right-radius:1.5rem;`,
      vertical: true,
      children: [
        Widget.Label({
          hpack: "center",
          css: `
              min-height:${heigth * 1 / 4}px;
              font-size:1rem;color:#ff5a5d;
              font-weight:800`,
          setup: (self) =>
            Utils.idle(() => {
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth() + 1;
              self.label = currentYear + "年" + currentMonth + "月";
            }),
        }),
      ],
    });
  }

  caledarBottom(heigth) {
    return Widget.FlowBox({
      css: `min-height:${heigth * 3 / 4}px;
            background:#fff;
            padding:0 1rem;
            border-bottom-left-radius:1.5rem;
            border-bottom-right-radius:1.5rem;`,
      min_children_per_line: 7,
      max_children_per_line: 7,
      vpack: "fill",
      homogeneous: true,
      setup: (self) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const calendars: any = lunar.calendar(currentYear, currentMonth, true);
        const currentDay = currentDate.getDate();
        const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六", ...calendars?.monthData || []];
        let firstDay = false

        weeks.forEach(item => {
          const isString = typeof item == "string"
          const fontSize = isString ? "1rem" : (currentMonth == item.month ? "0.8rem" : "0")
          const fontWeigth = isString ? "800" : (currentDay == item.day ? "800" : "500")
          const color = currentDay == item.day ? "#ff5a5d" : "#000"
          if (currentMonth == item.month) {
            firstDay = true
          }

          if (firstDay && currentMonth != item.month) {
            return
          }

          self.add(
            Widget.Label({
              css: `font-size:${fontSize};
                    font-weight:${fontWeigth};
                    color:${color}`,
              label: isString ? item : (currentMonth == item.month ? item.day + "" : "")
            })
          )
        });


      },
    });
  }

  topWeek(heigth) {
    return Widget.Box({
      vertical: false,
      homogeneous: true,
      vpack: "fill",
      hpack: "fill",
      css: `min-height:${heigth * 3 / 28}px;
            font-size:0.8rem;
            font-weight:800;color:#000`,
      setup: (self) => {
        const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const childArr: any[] = [];
        weeks.map((labeltxt) => {
          const widget = Widget.Label({
            label: labeltxt,
          });
          childArr.push(widget);
        });
        self.children = childArr;
      },
    });

  }

  computeCalc(weeks, height) {

    const widget = Widget.Box({
      vertical: false,
      homogeneous: true,
      vpack: "fill",
      hpack: "fill",
      css: `min-height:${height * 3 / 28 - 5}px;font-size:0.8rem;font-weight:600;color:#333;`,
      setup: (self) => {
        const childArr: any[] = [];
        weeks.map((oneday) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
          let dayTxt = ""
          if (currentMonth == oneday.month) {
            let extend = "";
            dayTxt = oneday.day + extend;
          }
          const widget = Widget.Label({
            label: dayTxt,
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

  }
}


export default Caledar 
