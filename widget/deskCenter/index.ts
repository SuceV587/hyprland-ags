import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Weather from "./weather";
import Caledar from "./caledar";
import BatteryAndClock from "./batteryAndClock";
import PictureAndSys from "./pictureAndSys";
import TodoAndMusic from "./todoAndMusic";

class DeskCenter {
  mainWidget: Gtk.Window
  constructor(monitor: number = 1) {
    this.mainWidget = this.init(monitor)
  }

  init(monitor) {
    return Widget.Window<Gtk.Widget>({
      monitor,
      className: 'f-desk-center',
      name: `deskCenter_${monitor}`,
      layer: 'background',
      anchor: ["top", "left", "right"],
      margins: [10, 30, 0, 30],
      child: this.initWidget()
    })
  }

  initWidget() {
    return Widget.FlowBox({
      vpack: "fill",
      hpack: "fill",
      css: `min-height:1px`,
      row_spacing: 20,
      column_spacing: 20,
      homogeneous: true,
      min_children_per_line: 3,
      max_children_per_line: 3,
      setup: self => {
        self.add(new Weather().mainWidget)
        self.add(new Caledar().mainWidget)
        self.add(new BatteryAndClock().mainWidget)
        self.add(new PictureAndSys().mainWidget)
        self.add(new TodoAndMusic().mainWidget)



      }
    })
  }


}


export default DeskCenter
