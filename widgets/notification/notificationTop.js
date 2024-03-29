import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { NotificationWidget } from './notification.js'
const { GLib, Gdk, Gtk } = imports.gi;

const notificationTop = (monitor) => {
  const mainBox = Widget.Box({
    vertical: true,
    className: 'f-notification-popup',
    attribute: {
      'map': new Map(),
      'dismiss': (box, id, force = false) => {
        //如果当前状态是hover,则不消失
        if (!id || !box.attribute.map.has(id) || box.attribute.map.get(id)._hovered && !force) {
          return;
        }

        const notif = box.attribute.map.get(id);
        Utils.timeout(5000, () => {
          if (notif._destroyed) {
            return
          }
          notif.revealChild = false;
        });
      },

      'notify': (box, id) => {
        if (!id || Notifications.dnd)
          return;

        if (!Notifications.getNotification(id))
          return;

        box.attribute.map.delete(id);

        const notificationContent = Notifications.getNotification(id);
        const notificationWidget = NotificationWidget({
          notifObject: notificationContent,
          isPopup: true,
        })

        box.attribute.map.set(id, notificationWidget);

        box.children = Array.from(box.attribute.map.values()).reverse();

        Utils.timeout(10, () => {
          if (notificationWidget._destroyed) {
            return
          }

          notificationWidget.revealChild = true;
        });

        box.attribute.map.get(id).interval = Utils.interval(4500, () => {
          const notif = box.attribute.map.get(id);
          if (!notif._hovered) {
            if (notif.interval) {
              // Utils.timeout(500, () => notif.destroy());
              GLib.source_remove(notif.interval);
              notif.interval = undefined;
            }
          }
        });
      },
    },
    connections: [
      [Notifications, (box, id) => box.attribute.notify(box, id), 'notified'],
      [Notifications, (box, id) => box.attribute.dismiss(box, id), 'dismissed'],
      [Notifications, (box, id) => box.attribute.dismiss(box, id, true), 'closed'],
    ],
  });



  const win = Widget.Window({
    monitor,
    name: `top_notification_${monitor}`,
    margins: [0, 20, 0, 0],
    anchor: ['top', 'right'],
    child: mainBox,
    layer: 'overlay'  //可以被覆盖在底层。相当于css里面z-index较低的层级
  })
  return win

}

export default notificationTop
