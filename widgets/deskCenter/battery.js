const { Gdk, Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { find_icon } from '../../lib/iconUtils.js'


export const battery = (avg_row_px) => {
  const battery_width = (avg_row_px - 20) * 2.5 / 3

  const singleBatterWidget = (percent, icon_name) => {
    const rounded = percent <= 0 ? false : true
    const battery = Widget.CircularProgress({
      className: 'u-battery',
      css:
        `min-width: ${battery_width}px;` +
        `min-height :${avg_row_px * 2 / 3}px;` +
        'font-size: 22px;' +
        'background-color: #f0f0f0;' +
        'color: #00C957;',
      child: Widget.Icon({
        css: `min-width:${(battery_width - 15) / 3}px;min-height:${(battery_width - 15) / 3}px`,
        icon: find_icon(icon_name),
        setup: (self) => Utils.timeout(1, () => {
          if (self._destroyed) {
            return
          }
          const styleContext = self.get_style_context();
          const width = styleContext.get_property('min-width', Gtk.StateFlags.NORMAL);
          const height = styleContext.get_property('min-height', Gtk.StateFlags.NORMAL);
          self.size = Math.max(width, height, 1);
        }),
      }),
      value: percent / 100,
      rounded: rounded,
      inverted: false,
      startAt: 0.75,
    });

    const batter_wrap = Widget.Box({
      vertical: true,
      hpack: 'fill',
      vpack: 'center',
      children: [
        battery,
        Widget.Label({
          css: 'margin-top:15px;font-size:1rem;font-weight:700;color:#555',
          label: percent > 0 ? percent + '%' : ''
        })
      ]

    })


    return batter_wrap
  }


  const batterWidget = Widget.Box({
    className: 'f-battery',
    css: `min-width:${avg_row_px * 2.5}px;`,
    spacing: 20,
    properties: [
      ['update', (box) => {
        const blueDevice = Bluetooth['connected-devices']
        const deviceList = [
          { battery: Battery.percent, type: 'charg-computer' }
        ]
        blueDevice.map(item => {
          const deivce = {
            battery: item._device['battery_percentage'] || 0,
            type: item._device['icon']
          }
          deviceList.push(deivce)
        })

        //凑足四个圈。
        const supplement = 3 - deviceList.length
        if (supplement > 0) {
          for (let i = 0; i < supplement; i++) {
            deviceList.push({
              battery: 0,
              type: null,
            })
          }
        }

        const deviceWidget = []
        deviceList.map(item => {
          deviceWidget.push(singleBatterWidget(item.battery, item.type))
        })
        box.children = deviceWidget
      }]
    ],
    //10s更新一下电池电量
    connections: [[10000, self => {
      self._update(self)
    }]],
    setup: (self) => {
      Utils.timeout(1000, () => {
        self._update(self)
      });
    }
  })

  return batterWidget
}
