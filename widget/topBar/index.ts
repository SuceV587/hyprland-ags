import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import type Gtk from "gi://Gtk?version=3.0"
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
const { Gravity } = imports.gi.Gdk;



const topBar = function(monitor: number): Gtk.Window {
  return Widget.Window({
    name: `topBar_${monitor}`,
    monitor,
    anchor: ['top', 'left', 'right'],
    child: new Bar().initWidget(),
    margins: [2, 0, 5, 0],
    exclusivity: 'exclusive',
    layer: 'top'
  })
}

class Bar {
  workspaceSort: string[]
  trayRevealer?: any
  constructor() {
    this.workspaceSort = ["  1Dock", "  2Browser", "  3Code2", "  4Chat", "  5Vmware", "  6Other1", "7 󰨇 monitor0"]
  }

  initWidget(): Gtk.Box {
    return Widget.CenterBox({
      css: `min-height: 2.2rem;
            background-color:transparent;
            color: #fff;`,
      spacing: 1,
      vertical: false,
      startWidget: this.leftPart(),
      endWidget: this.rightPart(),
    })
  }

  leftPart(): Gtk.Box {
    return Widget.Box({
      css: `font-family: 'JetBrains Mono Nerd Font', 'JetBrains Mono NL', 'SpaceMono Nerd Font', monospace;
              font-size: 1rem;
              color:#fff;
              font-weight: 800;
              min-height: 2.2rem;
              margin-left: 1rem;
            `,
      children: [
        Widget.Label().poll(5000, self => {
          execAsync(['date', "+%H:%M  %m月%d日 周%a"]).then((timeString: string) => {
            self.label = timeString;
          }).catch(print);
        }),

        Widget.Label({
          className: 'font',
          label: Hyprland.active.workspace.bind("id").as((id: number) => {
            const workspaceName = this.workspaceSort[id - 1]
            return "  " + workspaceName
          }),
        })
      ]
    })
  }
  rightPart(): Gtk.Widget {
    return Widget.Box({
      css: `
        font-family: 'JetBrains Mono Nerd Font', 'JetBrains Mono NL', 'SpaceMono Nerd Font', monospace;
        background-color:transparent;
        font-size: 1rem;
        font-weight: 800;
        margin-left: 1rem;
        min-height: 2.2rem;
        background-color:transparent;
        color: #fff;
      `,
      hpack: 'end',
      vpack: 'fill',
      vertical: false,
      children: [
        // wifi_widget(),
        // volumn_widget(),
        this.batterWidget(),
        this.tempWidget(),
        this.sysTrayWidget()
      ],
    })

  }
  batterWidget(): Gtk.Widget {
    return Widget.Label({
      className: 'font',
      css: 'margin-right:0.5rem;font-size:1.2rem;font-weight:800',
      attribute: {
        'update': (box) => {
          const battery = Battery.percent
          if (!battery) {
            return
          }
          let icon = '  '
          if (battery > 90) {
            icon = '  '
          } else if (battery > 75) {
            icon = '  '
          } else if (battery > 50) {
            icon = '  '
          } else if (battery > 25) {
            icon = '  '
          }
          box.label = icon
        }
      },
      setup: (self) => {
        Utils.timeout(1000, () => {
          self.attribute.update(self)
        });
      }
    }).poll(10000, self => {
      self.attribute.update(self)
    })

  }
  //cpu温度组件
  tempWidget(): Gtk.Widget {
    return Widget.Label({
      className: 'font',
      css: 'margin-right:1rem;font-size:1.0rem;font-weight:600',
      attribute: {
        'update': (box: Gtk.Label) => {
          execAsync([`bash`, `-c`, `sensors | grep 'Tctl' | awk '{print $2}'`]).then(tmpStr => {
            const temp = tmpStr.replace('+', '')
            box.label = '  ' + temp
          })
        }
      },
    }).poll(5000, self => {
      self.attribute.update(self)
    })

  }

  sysTrayWidget(): Gtk.Widget {
    this.trayRevealer = Widget.Revealer({
      revealChild: false,
      transition: 'slide_left',
      transitionDuration: 3000,
      child: this.trayContent(),
    });
    return this.trayRevealer
  }

  trayContent(): Gtk.Box {
    return Widget.Box({
      className: "u-systray",
      vpack: 'center',
      css: `
        margin-right: 1rem;
        background-color:rgba(255, 255, 255, 0.2);
        border-radius: 2rem;
      `,
      attribute: {
        items: new Map(),
        onAdded: (box, id: string) => {
          const item = SystemTray.getItem(id);
          if (!item) return;
          if (box.attribute.items.has(id) || !item) {
            return
          }
          const widget = this.sysTrayItem(item);
          box.attribute.items.set(id, widget);
          box.pack_start(widget, false, false, 0);
          box.show_all();
          if (box.attribute.items.size === 1) {
            this.trayRevealer.reveal_child = true;
          }
        },
        onRemoved: (box, id: number) => {
          if (!box.attribute.items.has(id)) {
            return;
          }

          box.attribute.items.get(id).destroy();
          box.attribute.items.delete(id);
          if (box.attribute.items.size === 0)
            this.trayRevealer.reveal_child = false;
        },
      },
    }).hook(SystemTray, (self, id) => {
      self.attribute.onAdded(self, id)
    }, 'added').hook(SystemTray, (self, id) => {
      self.attribute.onRemoved(self, id)
    }, 'removed');
  }

  sysTrayItem(item) {
    return Widget.Button({
      className: 'bar-systray-item',
      child: Widget.Icon({
        hpack: 'center',
        icon: item.bind('icon').as(n=>{
          return n
        }),
      }),
      tooltipMarkup: item.bind('tooltipMarkup'),
      onClicked: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
      onSecondaryClick: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
    });
  }
}

export default topBar
