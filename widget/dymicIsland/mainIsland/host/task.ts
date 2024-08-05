import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import runAppsVariable, { findApps, showMaxNums, getTotalPage, initRunApps, scrollApps } from '../../../../variables/runApps'
import dymicIslandVaribale, { taskOnOffFunc } from '../../../../variables/dymicIsland'
import { getClientIcon, ignoreAppsClass, focus } from "../../../../lib/client";
import { setupCursorHover } from "../../../../lib/cursorhover"
import { show_uri } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { selection_owner_get_for_display } from "types/@girs/gdk-3.0/gdk-3.0.cjs";


const focusClient = () => {
  const clients = runAppsVariable.value.apps
  const hover = runAppsVariable.value.hover

  if (clients[hover]) {
    focus(clients[hover])
    taskOnOffFunc()
  }
}

class Task {
  mainWidget: Gtk.Widget
  constructor() {
    this.mainWidget = this.init()
  }
  init() {
    //@calc + 2rem
    return Widget.Box({
      css: `
        background:#000;
        border-radius:2rem;
        min-width:45rem;
        padding:1rem;
        `,
      child: this.apps(),
    })
  }
  apps() {
    return Widget.EventBox({
      onScrollUp: () => {
        scrollApps("up")
      },
      onScrollDown: () => {
        scrollApps("down")
      },
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        children: [
          this.appEntry(),
          this.appsContent(),
          this.appsLable(),
          this.appsPageDot(),
        ],
        setup: (self) => {
          self.on('key-press-event', (widget, event) => { // Typing
            const keyval = event.get_keyval()[1];
            //往下翻
            if (keyval == 107 || keyval == 108 || keyval == 110 || keyval == 65364) {
              scrollApps("down")
            }

            //往上翻
            if (keyval == 106 || keyval == 104 || keyval == 112 || keyval == 65362) {
              scrollApps("up")
            }

            //按enter
            if (keyval == 65293) {
              focusClient()
            }

            //按esc,注意不能让被hyprland绑定
            if (keyval == 65307) {
              taskOnOffFunc
            }
          })
        }
      })
    })
  }
  //calc 3.5rem
  appEntry() {
    return Widget.Box({
      hpack: "fill",
      child: Widget.Entry({
        hexpand: true,
        vpack: "center",
        placeholder_text: ' search run windows',
        //@calc + 2rem
        css: `padding-left:0.5em;
              margin:0 5rem 0.5rem 5rem;
              font-size:0.8rem;
              min-height:2rem;
              border:0;
              background-color:rgba(252,252,252,0.8);
              color:#fff;
              border-radius:0.5rem`,
        onAccept: () => {
          focusClient()
        },
        onChange: ({ text }) => { // this is when you type
          findApps(text)
        },
      })
        .hook(dymicIslandVaribale, (self) => {
          if (dymicIslandVaribale.value.host == "task") {
            setTimeout(function() {
              initRunApps()
              self.grab_focus();
            }, 10)
          }
        })
    })
  }

  //calc:1rem
  appsPageDot() {
    return Widget.Box({
      vpack: "center",
      hpack: "center",
    }).hook(runAppsVariable, self => {
      const total = getTotalPage()
      const current = Math.ceil((runAppsVariable.value.trueHover + 1) / showMaxNums)
      const childrenWidget: Gtk.Label[] = []
      for (let index = 1; index <= total; index++) {
        if (current == index) {
          childrenWidget.push(
            Widget.Label({
              css: "font-size:0.7rem;color:rgba(255,255,255,1)",
              label: " "
            })
          )
        } else {
          childrenWidget.push(
            Widget.Label({
              css: "font-size:0.7rem;color:rgba(255,255,255,0.3)",
              label: " "
            })
          )
        }
      }
      self.children = childrenWidget
    }, "changed")


  }

  //calc 4rem 
  appsContent() {
    return Widget.Box({
      hpack: "center",
      children: new Array(showMaxNums).fill(1).map((_, index) => this.clickEventWrap(index)),
    })
  }

  clickEventWrap(index) {
    const widget = Widget.EventBox({
      hpack: "center",
      onPrimaryClick: () => { //make the widget hide when hovering
        const { hover, apps, trueHover } = runAppsVariable.value
        if (index != hover) {
          runAppsVariable.setValue({ apps, trueHover, hover: index })
        } else {
          focusClient()
        }
      },
      child: this.appsItem(index),
      setup: self => {
        setupCursorHover(self)
      }
    })
    return widget
  }

  appsItem(index) {
    const widget = Widget.Revealer({
      revealChild: false,
      transition_duration: 100,
      transition: "slide_down",
      hpack: "center",
      child: Widget.Box({
        hpack: "center",
        css: "min-height:5rem;padding:0 0.25rem;border-radius:1rem;",
        child: Widget.Icon({
          setup: self => {
            Utils.timeout(100, () => {
              const width = self.get_parent()?.get_style_context()?.get_property("min-height", "NORMAL",);
              self.size = width || 64
            })

            self.hook(runAppsVariable, self => {
              const { apps } = runAppsVariable.value
              if (!apps[index]) {
                return
              }
              self.icon = getClientIcon(apps[index]['class'], apps[index]['title'])
            }, "changed")
          }
        })
      })
    }).hook(runAppsVariable, self => {
      const { apps, hover } = runAppsVariable.value
      self.child.toggleClassName("taskHover", hover == index)
      self.visible = apps[index] ? true : false
      Utils.timeout(110, () => {
        self.reveal_child = apps[index] ? true : false
      })
    }, "changed")
    return widget
  }


  //cacle 1rem
  appsLable() {
    return Widget.Box({
      hpack: "center",
      child: Widget.Label({
        css: 'min-height:1rem;font-size:0.6rem;color:#fff;font-weight:800',
        vpack: "center",
        hpack: "center",
        maxWidthChars: 55,
        ellipsize: 3,
        wrap: true,
      }).hook(runAppsVariable, self => {
        const { apps, hover } = runAppsVariable.value
        if (apps[hover]) {
          self.label = apps[hover]['title'] ?? ""
        } else {
          self.label = "Not found"
        }
      }, 'changed')

    })
  }

}

export default Task
