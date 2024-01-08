const { Gdk, Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { find_icon } from '../../lib/iconUtils.js'


export const battery = (avg_row_px) => {

  const singleBatterWidget = (percent, icon_name) => {
    const rounded = percent <= 0 ? false : true

    const battery = (batteryWidth)=>{ 

      if(batteryWidth < 60){
        batteryWidth = avg_row_px * 3 / 4
      }

      const circular= Widget.CircularProgress({
            className: 'u-battery',
            css:
              `min-width:${batteryWidth-60}px;`+
              `min-height:${batteryWidth-60}px;`+
              'font-size: 22px;' +
              'background-color: #f0f0f0;' +
              'color: #00C957;',
            child: Widget.Icon({
              icon: find_icon(icon_name),
              setup: (self) => Utils.timeout(10, () => {
                if (self._destroyed) {
                  return
                }
                const iconWidth = (avg_row_px) * 1 / 6
                self.size = Math.max(iconWidth, iconWidth, 1);
              }),
            }),
            value: percent / 100,
            rounded: rounded,
            inverted: false,
            startAt: 0.75,
      });

      return  Widget.Box({
        css:`min-height:${batteryWidth}px;`,
        hpack:'center',
        vpack:'center',
        children:[circular]
      })
    }

    const batteryLabel = Widget.Label({
        css: 'font-size:1rem;font-weight:700;color:#555',
        label: percent > 0 ? percent + '%' : ''
    })

    const batter_wrap = Widget.Box({
      vertical: true,
      hpack: 'fill',
      vpack: 'fill',
      setup:self=>{
        Utils.timeout(100,()=>{
          let batteryWidth = self.get_allocated_width();
          // const batterHeight = self.get_allocated_height()
          if (batteryWidth <=0){
            return
          }
          batteryWidth =Math.floor(batteryWidth)

          if (typeof batteryWidth !== "number"){
            return 
          }

          self.children=[battery(batteryWidth),batteryLabel]
        })
      }
    })
    return batter_wrap
  }


  const batterWidget = Widget.Box({
    className: 'f-battery',
    css: `min-width:${avg_row_px * 3}px;background-color: rgba(232,232,232,0.8);border-radius: 1.5rem;`,
    homogeneous: true,
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
        const supplement = 4 - deviceList.length
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
    connections: [[60000, self => {
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
