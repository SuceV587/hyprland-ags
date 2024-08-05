import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import MainIsland from "./mainIsland/index"
import dymicIslandVaribale from '../../variables/dymicIsland'

class DymicIsland {
  mainWidget: Gtk.Window
  constructor(monitor: number = 1) {
    this.mainWidget = this.init(monitor)
  }

  init(monitor: number) {
    return Widget.Window<Gtk.Widget>({
      monitor,
      name: `dymicIsland_${monitor}`,
      anchor: ['top'],
      child: this.mainBox(),
      margins: [-32, 0, 2, 0],
      layer: 'top',
      keymode: "on-demand",
    }).hook(dymicIslandVaribale, self => {
      self.keymode = dymicIslandVaribale.value.host == "task" ? "exclusive" : "none"
    }, "changed")
  }
  mainBox() {
    return Widget.Box({
      css: "font-family: 'JetBrains Mono Nerd Font', 'JetBrains Mono NL', 'SpaceMono Nerd Font', monospace;",
      vertical: false,
      child: new MainIsland().mainWidget
    });
  }

}

export default DymicIsland
