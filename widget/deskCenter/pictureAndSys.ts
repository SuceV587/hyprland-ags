import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js'


class PictureAndSys {

  mainWidget!: Gtk.Widget
  resetWidth: boolean

  constructor() {
    this.resetWidth = false
    this.mainWidget = this.init()
  }

  init() {
    return Widget.Box({
      className: "f-picSys",
      css: "min-width:1px;min-height:1px",
      spacing: 20,
      homogeneous: true,
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
        this.picture(width, height),
        this.sys(width, height)
      ]
    })

  }

  picture(width, height) {
    return Widget.Box({
      hpack: "fill",
      vpack: "fill",
      vertical: true,
      css: `background-color:rgba(232,232,232,0.8);
            border-radius:2rem;
            background-image:url('/home/amao/.config/awesome/wallpapers/bg2.jpg');
            background-size:cover;`,
    });
  }

  sys(width, height) {
    return Widget.Box<any>({
      hpack: "fill",
      vertical: true,
      css: `
            background-color:rgba(232,232,232,0.8);
            border-radius:2rem
        `,
      children: [
        this.topSysPart(height),
        this.bottomSysPart(height),
      ],
    });
  }

  topSysPart(height) {
    const widget = Widget.Box({
      homogeneous: true,
      hexpand: true,
      vexpand: true,
      vpack: "center",
      css: `
          min-height:${height * 2 / 3}px;
        `,
      children: [
        this.makeCircle(),
        this.makeCircle(),
      ],
    });

    return widget;

  }

  bottomSysPart(height) {
    const widget = Widget.Box({
      homogeneous: true,
      vpack: "center",
      vexpand: true,
      hexpand: true,
      css: `
            min-height:${height * 1 / 3}px;
            `,
      child: this.porgressBar(),
    });

    return widget;
  }


  makeCircle = (params = {}) => {
    const widget =
      Widget.Box({
        vexpand: true,
        hexpand: true,
        css: `
          padding:1rem;
        `,
        child: Widget.CircularProgress({
          vexpand: true,
          hexpand: true,
          css:
            `
              font-size: 0.9rem;
              background-color: #f0f0f0;
              color: #00C957;
            `,
          child: Widget.Label({
            css: "font-size:0.7rem;color:#555;font-weight:800",
            label: params.name || "MEM",
          }),
          value: 0.3,
          rounded: true,
          inverted: false,
          startAt: 0.75,
        })
      })

    return widget;
  }

  porgressBar() {
    const widget = Widget.Box({
      vexpand: true,
      hexpand: true,
      vpack: "center",
      vertical: "true",
      css: `
        padding:0 2rem;
      `,
      children: [
        Widget.ProgressBar({
          vpack: "center",
          hpack: "fill",
          css: `min-height:0.7rem;border-radius:15px;border:0;background-color:#00C957`,
          value: 0.3
        }),
        Widget.Label({
          css: "font-size:0.8rem;font-weight:800;color:#555;padding-top:10px;",
          label: "Disk Usage:30G , Avaiable:250G"
        })
      ],
    });
    return widget;
  }

}

export default PictureAndSys 
