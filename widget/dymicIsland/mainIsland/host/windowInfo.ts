import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { getClientIcon, ignoreAppsClass } from '../../../../lib/client'
import { IconProps } from "types/widgets/icon";

const barHeight = 2;
const workspaceDotCss = {
  active:
    "min-width:0.3rem;min-height:0.3rem;border-radius:999rem;background-color:#fff;color:#fff",
  noActive:
    "min-width:0.3rem;min-height:0.1rem;border-radius:999rem;background-color:#666;color:#fff",
  notice:
    "min-width:0.3rem;min-height:0.1rem;border-radius:999rem;background-color:red",
};

class WindowInfo {
  mianWidget: Gtk.Widget
  constructor() {
    this.mianWidget = this.init()
  }

  init() {
    const widget = Widget.CenterBox({
      css: `background-color:#000;
            border-radius:1.75rem;
            min-height:${barHeight}rem;
            padding-left:0.5rem;
            padding-right:0.3rem`,
      startWidget: this.clientIconBox(),
      centerWidget: this.workspaceStatus(),
      endWidget: this.clientStatus(),
    });

    return widget;
  }

  workspaceStatus() {
    return Widget.Box({
      vpack: "center",
      hpack: "center",
      spacing: 3,
      children: new Array(7).fill(1).map(_ => this.singleDots()),
    }).hook(Hyprland.active.workspace, self => {
      self.children.forEach((item, index) => {
        if (index == Hyprland.active.workspace.id - 1) {
          item.setCss(workspaceDotCss.active);
        } else {
          item.setCss(workspaceDotCss.noActive);
        }
      })
    }, "changed")
  }

  singleDots() {
    return Widget.Box({
      css: workspaceDotCss["noActive"],
    });
  }

  clientStatus() {
    return Widget.Box({
      css: `padding:0.3rem;`,
      hpack: "end",
      vpack: "fill",
      children: [
        Widget.Box({
          spacing: 5,
          children: [
            this.clientStatusFloating(),
          ],
        }),
      ],

    })
  }
  clientStatusFloating() {
    return Widget.Label({
      className: "floatStatus",
      label: "f",
    }).hook(Hyprland, (self, event?: string, data?: string) => {
      let params = data ? data.split(",") : []
      if (event === "changefloatingmode") {
        const c = Hyprland.getClient("0x" + params[0] || "")
        self.toggleClassName("active", c?.floating)
      }

      if (event === "activewindowv2") {
        const c = Hyprland.getClient("0x" + params[0] || "")
        self.toggleClassName("active", c?.floating)
      }
    }, "event")
  }

  clientIconBox() {
    const clientIconBox = Widget.Box({
      css: `min-height:${barHeight}rem;min-width:2rem;`,
      hpack: "fill",
      vpack: "fill",
      child: this.icon()
    })

    return clientIconBox
  }

  icon() {
    return Widget.Icon<IconProps>({
      setup: (self) => Utils.timeout(10, () => {
        if (self.is_destroyed) {
          return
        }

        if (self.get_parent() == null) {
          return;
        }

        const styleContext = self.get_parent()?.get_style_context();
        const height = styleContext?.get_property("min-height", Gtk.StateFlags.NORMAL,);
        self.size = height - 3;
      }),
      icon: Hyprland.active.client.bind('class').as(appClass => {
        const icon = getClientIcon(appClass, Hyprland.active.client.title, false, true);
        return icon
      }),
    })
  }

}

export default WindowInfo
