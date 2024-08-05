import GtkType from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import blueDeviceVariable from '../../variables/blueDevice.js'
const { Gdk, Gtk } = imports.gi;
const Cairo = imports.cairo

class BatteryAndClock {
  mainWidget: GtkType.Widget
  resetWidth: boolean

  constructor() {
    this.resetWidth = false
    this.mainWidget = this.init()
  }

  init() {
    return Widget.Box({
      className: "f-battery-clock",
      spacing: 20,
    }).on("size-allocate", (self, allocation) => {
      const width = allocation.width || 200
      if (width < 100 || this.resetWidth) {
        return
      }
      this.resetWidth = true
      const height = (width - 20) / 3
      self.setCss(`min-width:${width}px;min-height:${height}px;`)

      //init child
      self.children = [
        this.clock(width, height),
        this.battery(width, height)
      ]
    })
  }

  clock(width, height) {
    return Widget.EventBox({
      child: Widget.Stack({
        className: 'f-clock-widget',
        css: `min-width:${height}px;
              min-height:${height}px;
              background:#000;
              border-radius:2rem
        `,
        transition: "slide_down",
        transitionDuration: 300,
        homogeneous: true,
        children: {
          "clock": this.clockItem(height),
          // "cutdownSet": cuntdownSet(avg_row_px),
          // "cuntdownMain": cuntdownMain(avg_row_px)
        },
        shown: "clock"
      }),
      setup: self => {
        // setupCursorHover(self)
      },
      onSecondaryClick: (self) => {
        // if (self.child.shown == "cutdownSet") {
        //   self.child.shown = "clock"
        // } else {
        //   self.child.shown = (cuntdownStatus.value == "stop" ? "cutdownSet" : "cuntdownMain")
        // }
      }
    })
    //   .hook(cuntdownStatus, (self) => {
    //   if (self.child.shown == "clock") {
    //     return
    //   }
    //
    //   if (cuntdownStatus.value == "stop") {
    //     self.child.shown = "cutdownSet"
    //   } else {
    //     self.child.shown = "cuntdownMain"
    //   }
    // }, "changed")

  }

  clockItem() {
    return Widget.Box({
      homogeneous: true,
      css: `
            padding:15px;
          `,
      child:
        Widget.DrawingArea({
          attribute: {
            'update': (area) => {
              area.connect('draw', (area, cr) => {

                const styleContext = area.get_style_context();
                const cx = Math.round(Math.max(styleContext.get_property('min-width', Gtk.StateFlags.NORMAL), area.get_allocated_width()) / 2);
                const cy = Math.round(Math.max(styleContext.get_property('min-height', Gtk.StateFlags.NORMAL), area.get_allocated_height()) / 2);

                const radius = Math.min(cx, cy);
                const hourHandLength = radius * 0.5;
                const minuteHandLength = radius * 0.7;
                const secondHandLength = radius * 0.9;


                // 绘制表盘
                cr.arc(cx, cy, radius, 0, 2 * Math.PI);
                cr.setSourceRGBA(1, 1, 1, 1);  // White color
                cr.fillPreserve();
                cr.setLineWidth(1);
                cr.setSourceRGBA(0, 0, 0, 1);  // Black color
                cr.stroke();

                // 绘制时针刻度
                cr.setLineCap(Cairo.LineCap.ROUND);
                for (let i = 1; i <= 12; i++) {

                  const angle = (Math.PI / 6) * i;
                  const x1 = cx + (radius - 10) * Math.sin(angle);
                  const y1 = cy - (radius - 10) * Math.cos(angle);
                  const x2 = cx + radius * Math.sin(angle);
                  const y2 = cy - radius * Math.cos(angle);

                  cr.moveTo(x1, y1);
                  cr.lineTo(x2, y2);
                  cr.setLineWidth(4);
                  cr.stroke();

                  // 绘制数字
                  const textAngle = (Math.PI / 6) * i;
                  let textX = cx + (radius - 20) * Math.sin(textAngle)
                  const textY = cy - (radius - 20) * Math.cos(textAngle)

                  // cr.selectFontFace("Sans", Cairo.FontSlant.NORMAL, Cairo.FontWeight.NORMAL);
                  cr.setFontSize(13);
                  cr.moveTo(textX, textY);
                  cr.showText(i.toString());
                }

                //绘制分/秒刻度
                for (let i = 0; i < 60; i++) {
                  const angle = (Math.PI / 30) * i;
                  const x1 = cx + (radius - 5) * Math.sin(angle);
                  const y1 = cy - (radius - 5) * Math.cos(angle);
                  const x2 = cx + (radius - 10) * Math.sin(angle);
                  const y2 = cy - (radius - 10) * Math.cos(angle);

                  cr.moveTo(x1, y1);
                  cr.lineTo(x2, y2);
                  cr.setLineWidth(2);
                  cr.stroke();
                }


                let timeStamp = new Date().getTime()
                let times = new Date()
                if (timeStamp >= 10000000) {
                  times = new Date(timeStamp)
                }

                // 绘制时针
                const hour = times.getHours() % 12;
                const minute = times.getMinutes();
                const second = times.getSeconds();
                const angleHour = (Math.PI / 6) * hour + (Math.PI / 360) * minute;
                const angleMinute = (Math.PI / 30) * minute;
                const angleSecond = (Math.PI / 30) * second;

                cr.moveTo(cx, cy);
                cr.lineTo(cx + hourHandLength * Math.sin(angleHour), cy - hourHandLength * Math.cos(angleHour));
                cr.setLineWidth(4);
                cr.stroke();

                // 绘制分针
                cr.moveTo(cx, cy);
                cr.lineTo(cx + minuteHandLength * Math.sin(angleMinute), cy - minuteHandLength * Math.cos(angleMinute));
                cr.setLineWidth(3);
                cr.stroke();


                // 绘制秒针
                cr.setSourceRGBA(1, 128 / 255, 0, 1);  // Yellow color
                cr.moveTo(cx, cy);
                cr.lineTo(cx + secondHandLength * Math.sin(angleSecond), cy - secondHandLength * Math.cos(angleSecond));
                cr.setLineWidth(1);
                cr.stroke();
              })
            }
          },
          setup: (box) => {
            box.attribute.update(box)
          },
        }).poll(1000, self => {
          self.queue_draw()
        })
    })
  }

  battery(width, height) {
    const batterWidget = Widget.Box({
      className: 'f-battery',
      css: `min-height:${height}px;
            background-color: rgba(232,232,232,0.7);
            border-radius: 2rem;`,
      homogeneous: true,
      setup: (self) => {
        Utils.idle(() => {
          const deviceListNums = 3
          const childrens: any[] = []
          for (let index = 0; index < deviceListNums; index++) {
            childrens.push(this.singleBatterWidget(index))
          }
          self.children = childrens
        });
      }
    })
    return batterWidget
  }

  singleBatterWidget(index) {
    return Widget.Box({
      css: `
        padding:0 15px;
      `,
      vexpand: true,
      hexpand: true,
      vertical: true,
      children: [
        this.batteryCircle(index),
        // this.batteryLabel(index)
      ]
    })
  }


  batteryCircle(index) {
    const circleIcon = Widget.Icon({
      size: 24,
      setup: self => {

      }
    }).hook(blueDeviceVariable, self => {
      Utils.idle(() => {
        const list = blueDeviceVariable.value
        if (list[index] && list[index]?.battery > -1) {
          const iconType = list[index].type || "charge-computer"
          self.icon = `${App.configDir}/assets/${iconType}.png`;
        }
      })
    }, "changed");

    return Widget.CircularProgress({
      className: 'u-battery',
      vexpand: true,
      // hexpand: true,
      css:
        `
        font-size: 1rem;
        background-color: #f0f0f0;
        color: #00C957;
      `,
      child: circleIcon,
      rounded: false,
      inverted: false,
      startAt: 0.75,
    }).hook(blueDeviceVariable, self => {
      const list = blueDeviceVariable.value
      if (list[index] && list[index]?.battery > -1) {
        self.value = list[index].battery / 100 ?? 0
        self.rounded = self.value > 0
      }
    }, "changed");
  }

  batteryLabel(index) {
    return Widget.Label({
      css: 'font-size:0.8rem;font-weight:700;color:#555',
      label: 'ddd'
    }).hook(blueDeviceVariable, self => {
      const list = blueDeviceVariable.value
      if (list[index] && list[index]?.battery > -1) {
        self.label = list[index].battery + "%" || ""
      }
    }, "changed");
  }
}
export default BatteryAndClock
