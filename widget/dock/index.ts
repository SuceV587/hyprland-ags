import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from "gi://Gtk?version=3.0"
import appButton, { dummyItem } from "../common/app"
import hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { getClientIcon, sortClientItems, substitute, focus, ignoreAppsClass } from "../../lib/client"
import Box from 'types/widgets/box';
import GLib from 'types/@girs/glib-2.0/glib-2.0';

const systemFunc = {
  "s_applauncher": () => {
    console.log("hello")
  }
}

let taskID: GLib.resource

class Dock {
  mainWidget: Gtk.Window
  public constructor(monitor: number = 1) {
    this.mainWidget = this.init(monitor)
  }

  init(monitor: number): Gtk.Window {
    return Widget.Window<Gtk.Widget>({
      monitor,
      className: 'f-dock-window',
      name: `dock${monitor}`,
      layer: 'top',
      anchor: ['bottom'],
      margins: [10, 0, 5, 0],
      exclusivity: 'exclusive',
      child: this.initWidget()
    })
  }

  initWidget(): Gtk.EventBox {
    return Widget.EventBox({
      vexpand: false,
      child: this.initDockWrap()
    })
  }

  initDockWrap() {
    return Widget.Stack({
      css: 'min-width:1rem',
      transition: "slide_up",
      transitionDuration: 600,
      children: {
        "dock": this.makeDock(),
        "line": this.makeLine(),
      },
      shown: "dock",
      attribute: {
        updateDock: (self, hover = false) => {
          // return false
          const { dock, line } = self.children
          if (hover) {
            self.shown = "dock"
            dock.reveal_child = true
            line.reveal_child = false
          } else {
            self.shown = "line"
            line.reveal_child = true
            dock.reveal_child = false
          }
        }
      },
    })
  }
  makeDock() {
    return Widget.Revealer({
      revealChild: true,
      transition: "none",
      child: this.makeDockWrap()
    })
  }

  makeLine() {
    return Widget.Revealer({
      revealChild: false,
      transition: "none",
      child: this.makeLineWrap()
    })
  }
  makeLineWrap() {
    //@todo长度应该根据显示器宽度设置
    return Widget.Box({
      // css:'min-width:0.5rem',
      className: "f-dock-wrap-line"
    })
  }

  makeDockWrap() {
    return Widget.Box({
      css: `
          min-height:1rem;
          background-color: rgba(252,252,252,0.6);
          padding-left:0.2rem;
          padding-right:0.2rem;
          padding-top:0.3rem;
          padding-bottom:0.3rem;
          border-radius:2rem;
          -gtk-outline-radius: 2rem;
          `,
      children: [
        this.pindSystemFunc(),
        // this.pinnedApps(),
        this.dockSeparator(),
        this.dockBar(),
      ],
    })
  }
  pindSystemFunc() {
    //appButton
    return Widget.Box({
      setup: (self) => {
        const children = []
        const childItmes: Gtk.Revealer[] = Object.keys(systemFunc).map(item => {
          const sysIcon: Gtk.Revealer = appButton({
            icon: getClientIcon(item),
            address: "",
            onClicked: () => {
              App.toggleWindow('applauncher')
            },
            tooltipText: "applauncher"
          })

          sysIcon.reveal_child = true
          return sysIcon
        })

        self.children = childItmes
      }

    })
  }

  dockSeparator() {
    return Widget.Box({
      className: "u-dock-separator"
    })
  }
  dockBar() {
    return Widget.Box({
      attribute: {
        update: (self: Box<Gtk.Widget, any>) => {
          self.children = sortClientItems(hyprland.clients.filter(c => c.pid > 0 && c.class !="").map(c => {
            if (c["pid"] == -1 || ignoreAppsClass.indexOf(c.class.toLowerCase()) !== -1) {
              return dummyItem(c.address || "")
            }
            const client = appButton({
              icon: getClientIcon(substitute(c.class)),
              address: c.address,
              tooltipText: `${c.title}-(${c.class})`,
              onClicked: () => {
                focus(c)
              }
            })
            //先return,然后延时reveal_child=true才会有动画
            setTimeout(() => {
              client.reveal_child = true
            }, 10);
            return client
          }))
        }
      },
      setup: self => self.attribute.update(self)
    }).hook(hyprland, (w, address?: string) => {
      if (typeof address === "string") {
        w.children = w.children.filter(ch => (ch as Box<Gtk.Widget, any>).attribute.address !== address)
      }
    }, "client-removed")
      .hook(hyprland, (w, address?: string) => {
        if (typeof address === "string") {
          const c = hyprland.getClient(address)
          if (!c) {
            return
          }

          if (c["pid"] == -1 || ignoreAppsClass.indexOf(c.class.toLowerCase()) !== -1) {
            return dummyItem(c.address || "")
          }
          const client = appButton({
            icon: getClientIcon(substitute(c.class)),
            address: c.address,
            tooltipText: `${c.title}-(${c.class})`,
            onClicked: () => {
              focus(c)
            }
          })

          w.children = sortClientItems([...w.children, client])
          client.reveal_child = true
        }
      }, "client-added")
      .hook(hyprland, (w, event?: string) => {
        if (event === "movewindow") {
          w.children = sortClientItems(w.children)
        }
      }, "event")
      .hook(hyprland.active, (w) => {
        const activeAddress = hyprland.active.client.address
        w.children.forEach(ch => (ch as Box<Gtk.Widget, any>).toggleClassName("dock-app-acive", (ch as Box<Gtk.Widget, any>).attribute.address == activeAddress))
      }, "changed")
  }
}

export default Dock
