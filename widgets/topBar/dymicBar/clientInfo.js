import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { getClientIcon, ignoreAppsClass } from "../../../lib/client.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
const { Gdk, Gtk } = imports.gi;

const barHeight = 2.1;
const workspaceDotCss = {
  active:
    "min-width:0.3rem;min-height:0.3rem;border-radius:999rem;background-color:#fff",
  noActive:
    "min-width:0.3rem;min-height:0.1rem;border-radius:999rem;background-color:#666",
  notice:
    "min-width:0.3rem;min-height:0.1rem;border-radius:999rem;background-color:red",
};

const clientInfoWidget = () => {
  const clientIconBox = Widget.Box({
    css: `min-height:${barHeight}rem;min-width:2rem;`,
    hpack: "fill",
    vpack: "fill",
    child: Widget.Icon({
      setup: (self) =>
        Utils.timeout(10, () => {
          if (self._destroyed) {
            return;
          }
          const styleContext = self.get_parent().get_style_context();
          const height = styleContext.get_property(
            "min-height",
            Gtk.StateFlags.NORMAL,
          );
          self.size = height - 3;
        }),
      connections: [
        [Hyprland.active.client, (self) => {
          const appClass = Hyprland.active.client.class.toLowerCase();
          if (!appClass) {
            return;
          }
          if (ignoreAppsClass.indexOf(appClass) !== -1) {
            return;
          }
          self.icon = getClientIcon(appClass);
        }],
      ],
    }),
  });

  //显示当前workspace打开了多少个窗口
  const clientStatusClientNums = Widget.Label({
    css:
      "background-color:#2aae67;color:#fff;border-radius:10rem;padding-left:0.7rem;padding-right:0.7rem",
    label: "",
    properties: [
      ["update", (self) => {
        const workspaceId = Hyprland.active.workspace.id;
        const clients = Hyprland.clients;
        let nums = 0;
        clients.map((item) => {
          if (item.workspace.id == workspaceId && item.pid > 0) {
            const appClass = item.class.toLowerCase();
            if (!appClass) {
              return;
            }

            if (ignoreAppsClass.indexOf(appClass) !== -1) {
              return;
            }

            nums++;
          }
        });
        if (nums > 1) {
          self.label = "+" + nums;
          self.setCss(
            "background-color:#2aae67;padding-left:0.7rem;padding-right:0.7rem",
          );
        } else {
          self.label = "";
          self.setCss("background-color:transparent");
        }
      }],
    ],
    connections: [
      [Hyprland, (self) => self._update(self), "client-added"],
      [Hyprland, (self) => self._update(self), "client-removed"],
      [Hyprland.active.workspace, (self) => self._update(self)],
    ],
  });

  const clientStatusFloating = Widget.Label({
    css:
      "background-color:#2aae67;color:#fff;border-radius:10rem;padding-right:0.7rem;padding-left:0.7rem",
    label: "f",
    connections: [[200, (self) => {
      const appAddress = Hyprland.active.client.address;
      if (!appAddress || appAddress == "0x") {
        return;
      } else {
        self.label = "f";
        const clients = Hyprland.clients;
        clients.map((item) => {
          if (item.address === appAddress) {
            if (item.floating) {
              self.setCss(
                "background-color:#2aae67;padding-left:0.7rem;padding-right:0.7rem",
              );
            } else {
              self.setCss(
                "background-color:#666666;padding-left:0.7rem;padding-right:0.7rem",
              );
            }
          }
        });
      }
    }]],
  });

  const clientStatus = Widget.Box({
    css: "padding:0.3rem",
    hpack: "end",
    vpack: "fill",
    children: [
      Widget.Box({
        spacing: 5,
        children: [
          clientStatusClientNums,
          //当前状态是否是浮动
          clientStatusFloating,
        ],
      }),
    ],
  });

  const singleDots = () => {
    return Widget.Box({
      css: workspaceDotCss["noActive"],
    });
  };
  const workspaceStatus = Widget.Box({
    vpack: "center",
    hpack: "center",
    spacing: 7,
    properties: [
      ["update", (self) => {
        const workspace = Hyprland.active.workspace;
        const childs = self.children;
        childs.map((item, index) => {
          if (index == workspace.id - 1) {
            item.setCss(workspaceDotCss["active"]);
          } else {
            item.setCss(workspaceDotCss["noActive"]);
          }
        });
      }],
    ],
    setup: (self) => {
      const childs = [];
      const nums = 7;
      for (let index = 0; index < nums; index++) {
        const dots = singleDots();
        childs.push(dots);
      }
      self.children = childs;
    },
    connections: [
      [Hyprland.active.workspace, (self) => self._update(self)],
    ],
  });

  const widget = Widget.CenterBox({
    css:
      `min-width:22rem;background-color:rgba(200,200,200,0.7);border-radius:10rem;min-height:${barHeight}rem;padding-left:0.5rem;padding-right:0.3rem`,
    startWidget: clientIconBox,
    centerWidget: workspaceStatus,
    endWidget: clientStatus,
  });

  return widget;
};

export default clientInfoWidget;
