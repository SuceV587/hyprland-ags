//use stric
import type Gtk from "gi://Gtk?version=3.0"
import Gdk from "gi://Gdk"


const monitorUtis = {

  forMonitors(widget: (monitor: number) => Gtk.Window): Gtk.Window[] {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1
    return this.range(n, 0).map(widget).flat(1)
  },

  range(length: number, start: number = 1): number[] {
    return Array.from({ length }, (_, i) => i + start)
  },

}


export default monitorUtis

