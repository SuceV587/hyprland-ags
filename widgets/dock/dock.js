const { Gdk, Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
// import { lookUpIcon, timeout } from 'resource:///com/github/Aylur/ags/utils.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
const { execAsync, exec } = Utils;
const { Box, EventBox, Label, Revealer, Overlay } = Widget;
import { find_icon } from '../../lib/iconUtils.js'
import { setupCursorHover } from '../../lib/cursorhover.js'
import { getClientByAdrees, getFullScreenClientAddress } from '../../lib/client.js'

const ANIMATION_TIME = 150;
const pinnedApps = [
  'org.gnome.Nautilus',
];


const ignoreAppsClass = [
  'image-missing',
  'fcitx',
  'rofi'
]

const clientMapWorkSpace = {}


function substitute(str) {
  const subs = [
    { from: 'code-url-handler', to: 'visual-studio-code' },
    { from: 'Code', to: 'visual-studio-code' },
    { from: 'GitHub Desktop', to: 'github-desktop' },
    { from: 'wpsoffice', to: 'wps-office2019-kprometheus' },
    { from: 'gnome-tweaks', to: 'org.gnome.tweaks' },
    { from: 'Minecraft* 1.20.1', to: 'minecraft' },
    { from: '', to: 'image-missing' },
  ];

  for (const { from, to } of subs) {
    if (from === str)
      return to;
  }

  return str;
}

const focus = (client) => {
  //这里的client的状态并不是最新的
  const { address } = client
  const liveClient = getClientByAdrees(address)

  //如果当前在special的window里面,则移出来
  if (liveClient.workspace.id < 0) {
    const oldWorkSpace = clientMapWorkSpace[address]
    if (oldWorkSpace) {
      Utils.exec(`hyprctl dispatch movetoworkspace ${oldWorkSpace},address:${address}`)
      Utils.exec(`hyprctl dispatch workspace ${oldWorkSpace}`)
    }
  }

  //如果当前已经是fullscreen的,不发生变化
  if (liveClient.fullscreen) {
    Utils.exec('hyprctl dispatch focuswindow address:' + address)
    return
  }


  //获取当前workspace里面是否有设置fullscreen的client
  const currentFullScreenAddress = getFullScreenClientAddress(liveClient.workspace.id)
  if (currentFullScreenAddress) {
    const fullScreenAdress = currentFullScreenAddress.address
    Utils.exec('hyprctl dispatch focuswindow address:' + fullScreenAdress)
    Utils.exec('hyprctl dispatch fullscreen 1')
  }


  Utils.exec('hyprctl dispatch focuswindow address:' + address)
  // Utils.exec('hyprctl dispatch cyclenext')
  Utils.exec('hyprctl dispatch alterzorder top,address:' + address)
  if (currentFullScreenAddress) {
    Utils.exec('hyprctl dispatch fullscreen 1')
  }
};

const DockSeparator = (props = {}) => Box({
  ...props,
  className: 'u-dock-separator',
})

const AppButton = ({ icon, address, ...rest }) => Widget.Revealer({
  properties: [
    ['workspace', 0],
  ],
  revealChild: false,
  transition: 'slide_right',
  transitionDuration: 500,
  child: Widget.Button({
    ...rest,
    className: 'dock-app-btn',
    child: Widget.Box({
      child: Widget.Overlay({
        child: Widget.Box({
          homogeneous: true,
          className: 'dock-app-icon-box',
          child: Widget.Icon({
            className: 'dock-app-icon',
            properties: [
              ['address', address],
            ],
            icon: icon,
            setup: (self) => Utils.timeout(1, () => {
              if (self._destroyed) {
                return
              }
              const styleContext = self.get_parent().get_style_context();
              const width = styleContext.get_property('min-width', Gtk.StateFlags.NORMAL);
              const height = styleContext.get_property('min-height', Gtk.StateFlags.NORMAL);
              self.size = Math.max(width, height, 1);
            }),
            connections: [
              [Hyprland.active.client, self => {
                if (self._address === Hyprland.active.client._address) {
                  self.setCss(`background-color:rgba(255,255,255,0.7)`);
                } else {
                  self.setCss(`background-color:transparent`);
                }
              }],
            ]
          }),
        })
      }),
    }),
    setup: (button) => {
      setupCursorHover(button);
    }
  })
});

const find_icon_path = function(appClass) {

  if (find_icon(appClass)) {
    return find_icon(appClass)
  }

  if (find_icon('system')) {
    return find_icon('system')
  }

  return appClass
}

const Taskbar = () => Widget.Box({
  className: 'dock-apps',
  properties: [
    ['map', new Map()],
    ['clientSortFunc', (a, b) => {
      return a._workspace > b._workspace;
    }],
    ['update', (box) => {
      Hyprland.clients.forEach(client => {
        if (client["pid"] == -1) return;
        const appClass = substitute(client.class).toLowerCase();
        for (const appName of pinnedApps) {
          if (appClass.includes(appName.toLowerCase()))
            return null;
        }

        const newButton = AppButton({
          icon: find_icon_path(appClass),
          address: client.address,
          tooltipText: `${client.title} (${appClass})`,
          onClicked: () => focus(client),
        });
        newButton._workspace = client.workspace.id;
        newButton.revealChild = true;
        box._map.set(client.address, newButton);
      })
      box.children = Array.from(box._map.values());
    }],
    ['add', (box, address) => {
      if (!address) { // Since the first active emit is undefined
        box._update(box);
        return;
      }
      const newClient = Hyprland.clients.find(client => {
        return client.address == address;
      });
      const appClass = substitute(newClient.class).toLowerCase();

      if (ignoreAppsClass.indexOf(appClass.toLowerCase()) !== -1) {
        return
      }

      const newButton = AppButton({
        icon: find_icon_path(appClass),
        address: newClient.address,
        tooltipText: `${newClient.title} (${appClass})`,
        onClicked: () => focus(newClient),
      })
      newButton._workspace = newClient.workspace.id;
      box._map.set(address, newButton);
      box.children = Array.from(box._map.values());
      newButton.revealChild = true;
    }],
    ['remove', (box, address) => {
      if (!address) return;

      const removedButton = box._map.get(address);

      //如果为空,则不处理
      if (!removedButton) {
        return
      }

      removedButton.revealChild = false;

      Utils.timeout(ANIMATION_TIME, () => {
        removedButton.destroy();
        box._map.delete(address);
        box.children = Array.from(box._map.values());
      })
    }],
  ],
  connections: [
    [Hyprland.active, () => {
      const address = Hyprland.active.client.address
      const workspace = Hyprland.active.workspace.id
      if (!address && !workspace) {
        return
      }
      clientMapWorkSpace[address] = workspace
    }],
    [Hyprland, (box, address) => box._add(box, address), 'client-added'],
    [Hyprland, (box, address) => box._remove(box, address), 'client-removed'],
  ],
  setup: (self) => {
    Utils.timeout(100, () => {
      if (self._destroyed) {
        return
      }
      return self._update(self)
    });
  }
});

const PinnedApps = () => Widget.Box({
  class_name: 'dock-apps',
  homogeneous: true,
  setup: (self) => {
    self.children = pinnedApps
      .map(term => ({ app: Applications.query(term)?.[0], term }))
      .filter(({ app }) => app)
      .map(({ app, term = true }) => {
        const newButton = AppButton({
          icon: find_icon_path(app.icon_name),
          address: '',
          onClicked: () => {
            for (const client of Hyprland.clients) {
              if (client.class.toLowerCase().includes(term))
                return focus(client);
            }

            app.launch();
          },
          onMiddleClick: () => app.launch(),
          setup: (self) => {
            self.revealChild = true;
          },
          tooltipText: app.name,
          connections: [[Hyprland, button => {
            const running = Hyprland.clients
              .find(client => client.class.toLowerCase().includes(term)) || false;

            button.toggleClassName('nonrunning', !running);
            button.toggleClassName('focused', Hyprland.active.client.address == running.address);
            button.set_tooltip_text(running ? running.title : app.name);
          }, 'notify::clients']],
        })
        newButton.revealChild = true;
        return newButton;
      })
  }
});

export default () => {
  //simple dock
  const makeDock1 = () => {
    return Revealer({
      revealChild: true,
      transition: 'none',
      child: Box({
        className: 'f-dock-wrap',
        children: [
          PinnedApps(),
          DockSeparator(),
          Taskbar(),
        ],
      })
    })
  }

  const makeDock2 = () => {
    return Revealer({
      revealChild: false,
      transition: 'none',
      child: Widget.Box({
        className: 'f-dock-wrap-line',
      })
    })
  }

  const dock1 = makeDock1()
  const dock2 = makeDock2()

  const stack = Widget.Stack({
    transition: 'slide_up',
    transitionDuration: 300,
    items: [
      ['child1', dock1],
      ['child2', dock2],
    ],
    shown: 'child1',
    properties: [
      ['update', (self, id, monitor) => {

        if (monitor != 'HDMI-A-1') {
          return
        }

        if (id == 1) {
          dock1.revealChild = true
          dock2.revealChild = false
          self.shown = 'child1'
        } else {
          dock2.revealChild = true
          dock1.revealChild = false
          self.shown = 'child2'
        }
      }]
    ],
    connections: [
      [Hyprland.active.workspace, self => {
        const id = Hyprland.active.workspace.id
        const monitor = Hyprland.active.monitor
        self._update(self, id, monitor)
      }],
    ],
  });

  return stack

}
