
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';

const { Box, Icon, Button, Revealer } = Widget;
const { Gravity } = imports.gi.Gdk;

const revealerDuration = 200;

const SysTrayItem = item => Button({
  className: 'bar-systray-item',
  child: Icon({
    hpack: 'center',
    binds: [['icon', item, 'icon']]
  }),
  binds: [['tooltipMarkup', item, 'tooltipMarkup']],
  // setup: btn => {
  //     const id = item.menu.connect('popped-up', menu => {
  //         menu.disconnect(id);
  //     });
  // },
  onClicked: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
  onSecondaryClick: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
});

export const Tray = (props = {}) => {
  const trayContent = Box({
    vpack: 'center',
    className: 'u-systray',
    attribute: {
      'items': new Map(),
      'onAdded': (box, id) => {
        const item = SystemTray.getItem(id);
        if (!item) return;
        item.menu.className = 'menu';
        if (box.attribute.items.has(id) || !item)
          return;
        const widget = SysTrayItem(item);
        box.attribute.items.set(id, widget);
        box.pack_start(widget, false, false, 0);
        box.show_all();
        if (box.attribute.items.size === 1)
          trayRevealer.revealChild = true;
      },
      'onRemoved': (box, id) => {
        if (!box.attribute.items.has(id))
          return;

        box.attribute.items.get(id).destroy();
        box.attribute.items.delete(id);
        if (box.attribute.items.size === 0)
          trayRevealer.revealChild = false;
      },
    },
    connections: [
      [SystemTray, (box, id) => box.attribute.onAdded(box, id), 'added'],
      [SystemTray, (box, id) => box.attribute.onRemoved(box, id), 'removed'],
    ],
  });
  const trayRevealer = Widget.Revealer({
    revealChild: false,
    transition: 'slide_left',
    transitionDuration: revealerDuration,
    child: trayContent,
  });



  return Box({
    ...props,
    children: [
      trayRevealer,
    ]
  });
}
