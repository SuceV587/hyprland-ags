//这是没有放大之前的主mainIsland(它可以被分离成两部分(host+slave),也可以隐藏显示变形后的mainIsland)
import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import hostWidgets from "./host/index"
import slave from "./host/slave"
import dymicIslandVaribale from '../../../variables/dymicIsland'
import WindowInfo from "./host/windowInfo";

const barHeight = 2

class MainIsland {
  mainWidget: Gtk.Widget
  constructor() {
    this.mainWidget = this.init()
  }
  init() {
    return Widget.Box({
      children: [
        this.host(),
        // this.slave()
      ]
    })
  }
  host() {
    const widget = Widget.Box({
      css: `border-radius:10rem;min-height:${barHeight}rem;min-width:23rem`,
      homogeneous: true,
      // transition: "slide_down",
      child: hostWidgets.windowInfo()
      // : {
      //    "windowInfo": host.windowInfo(),
      //    "task": host.task()
      //  },
      // shown: "windowInfo",
    }).hook(dymicIslandVaribale, self => {
      const { host, slave } = dymicIslandVaribale.value
      if (slave.length > 0) {
        self.class_name = "battery-inner-charging"
      } else {
        self.class_name = "slaveReversAnimation"
      }

      //host的切换
      self.toggleClassName("scaleAdd", host != "")
      self.toggleClassName("scaleEase", host == "")

      const childWidget = host == '' ? 'windowInfo' : host
      // if (childWidget == "task") {
      self.child = hostWidgets.empy()
      setTimeout(() => {
        self.child = hostWidgets[childWidget]()
      }, 110)
      // } else {
      //   self.child = hostWidgets[childWidget]()
      // }
    }, "changed")
    return widget
  }

  slave() {
    const slave = Widget.Stack({
      css: `margin-left:-3rem;background-color:transparent;`,
      transition: "slide_down",
      transitionDuration: 100,
      visible: true,
      children: {
        "music": musicWidget(barHeight),
        // cutdown: cutdown(barHeight)
      },
      shown: "music",
    }).hook(dymicIslandVaribale, self => {
      const dymicIslandSlave = dymicIslandVaribale.value.slave
      if (dymicIslandSlave.length > 0) {
        self.class_name = "circle-animation"
      } else {
        self.class_name = "reverse-circle"
      }

      self.shown = dymicIslandSlave.slice(-1)[0]
    }, "changed")
    return slave
  }
}

export default MainIsland

